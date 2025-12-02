from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import Post, Comment, Like
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import PostSerializer, CommentSerializer, UserSerializer
from .permissions import IsOwnerOrAdmin   # 🔥 Custom Permission


# ------------------------
# POST LIST + CREATE
# ------------------------
class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return []

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ------------------------
# POST DETAIL (GET + DELETE)
# ------------------------
class PostDetailAPIView(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrAdmin]   # 🔥 Only owner/admin can delete

    def get_serializer_context(self):
        return {"request": self.request}


# ------------------------
# COMMENT LIST + CREATE
# ------------------------
class CommentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return []

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ------------------------
# COMMENT DETAIL (GET + DELETE)
# ------------------------
class CommentDetailAPIView(generics.RetrieveDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


# ------------------------
# LIKE TOGGLE
# ------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    like, created = Like.objects.get_or_create(user=request.user, post=post)

    if not created:
        like.delete()
        liked = False
    else:
        liked = True

    return Response({
        "liked_by_user": liked,
        "likes_count": Like.objects.filter(post=post).count()
    })


# ------------------------
# REGISTER
# ------------------------
@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response(UserSerializer(user).data, status=201)


# ------------------------
# LOGIN
# ------------------------
@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)
    return Response({
        "user": UserSerializer(user).data,
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    })


# ------------------------
# USER PROFILE (GET + PUT)
# ------------------------
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if request.method == "GET":
        return Response(UserSerializer(user).data)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


# ------------------------
# GET ALL USERS (ADMIN ONLY)
# ------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    count = User.objects.count()
    users = UserSerializer(User.objects.all(), many=True).data
    return Response({"count": count, "users": users})


# ------------------------
# CREATE COMMENT (POST)
# ------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
