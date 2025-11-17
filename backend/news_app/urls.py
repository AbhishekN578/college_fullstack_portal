from django.urls import path
from .views import login_user
from .views import (
    PostListCreateAPIView,
    PostDetailAPIView,
    CommentListCreateAPIView,
    CommentDetailAPIView
)

urlpatterns = [
    path('posts/', PostListCreateAPIView.as_view()),
    path('posts/<int:pk>/', PostDetailAPIView.as_view()),
    path("login/", login_user),
    path('comments/', CommentListCreateAPIView.as_view()),   # FIXED
    path('comments/<int:pk>/', CommentDetailAPIView.as_view()),
]


