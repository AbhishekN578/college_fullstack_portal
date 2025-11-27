from rest_framework import serializers
from .models import Post, Comment, Like
from django.contrib.auth.models import User

# ------------------------
# USER SERIALIZER
# ------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

# ------------------------
# COMMENT SERIALIZER
# ------------------------
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # include username

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'comment', 'created_at']

# ------------------------
# POST SERIALIZER
# ------------------------
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  # include username
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'image', 'exam_file', 
                  'author', 'created_at', 'likes_count', 'comments_count']

    def get_comments_count(self, obj):
        return Comment.objects.filter(post=obj).count()
