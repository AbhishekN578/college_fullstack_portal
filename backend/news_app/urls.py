from django.urls import path
from .views import (
    login_user,
    register_user,
    PostListCreateAPIView,
    PostDetailAPIView,
    CommentListCreateAPIView,
    CommentDetailAPIView,
    toggle_like,
    user_profile,
    create_comment,
)

urlpatterns = [
    # Posts
    path('posts/', PostListCreateAPIView.as_view()),
    path('posts/<int:pk>/', PostDetailAPIView.as_view()),

    # Likes
    path('posts/<int:post_id>/like/', toggle_like),

    # Comments
    path('comments/', CommentListCreateAPIView.as_view()),
    path('comments/<int:pk>/', CommentDetailAPIView.as_view()),
    path('comments/create/', create_comment),

    # Auth
    path('login/', login_user),
    path('register/', register_user),

    # User Profile
    path('users/<int:user_id>/', user_profile),
]
