from rest_framework import serializers
from .models import Post, Comment, Like
from django.contrib.auth.models import User

# USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name']


# COMMENT SERIALIZER
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'comment', 'created_at']

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user     # AUTO ASSIGN USER
        return super().create(validated_data)


# POST SERIALIZER
class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"

    def get_likes_count(self, obj):
        return Like.objects.filter(post=obj).count()

    def get_comments_count(self, obj):
        return Comment.objects.filter(post=obj).count()

    def get_liked_by_user(self, obj):
        request = self.context.get("request")
        return Like.objects.filter(post=obj, user=request.user).exists() if request.user.is_authenticated else False
