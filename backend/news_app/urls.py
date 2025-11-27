from django.urls import path
from .views import (
    login_user,
    PostListCreateAPIView,
    PostDetailAPIView,
    CommentListCreateAPIView,
    CommentDetailAPIView,
    toggle_like,
)

urlpatterns = [
    # Posts
    path('posts/', PostListCreateAPIView.as_view()),
    path('posts/<int:pk>/', PostDetailAPIView.as_view()),

    # Likes
    path('posts/<int:post_id>/like/', toggle_like),  # POST request toggles like

    # Comments
    path('comments/', CommentListCreateAPIView.as_view()),
    path('comments/<int:pk>/', CommentDetailAPIView.as_view()),

    # Auth
    path('login/', login_user),
]
