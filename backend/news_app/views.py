from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer

# ------------------------
# POST APIs
# ------------------------
class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

class PostDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

# ------------------------
# COMMENT APIs
# ------------------------
class CommentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentDetailAPIView(generics.RetrieveDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

# ------------------------
# LIKE APIs
# ------------------------
@api_view(['POST'])
def toggle_like(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    like, created = Like.objects.get_or_create(user=user, post=post)

    if not created:
        # Already liked, so unlike
        like.delete()
        post.likes = Like.objects.filter(post=post).count()
        post.save()
        return Response({"message": "Unliked", "likes": post.likes})
    else:
        # New like
        post.likes = Like.objects.filter(post=post).count()
        post.save()
        return Response({"message": "Liked", "likes": post.likes})

# ------------------------
# LOGIN API
# ------------------------
@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        return Response({
            "message": "Login successful",
            "user_id": user.id,
            "username": user.username
        })
    else:
        return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)
