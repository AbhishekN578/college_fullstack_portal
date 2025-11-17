from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    highlight = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(upload_to='uploads/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
  


    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)




# class Post(models.Model):
#     title = models.CharField(max_length=255)
#     highlight = models.CharField(max_length=255)
#     content = models.TextField()
#     image = models.ImageField(upload_to="post_images/", blank=True, null=True)

#     # NEW FIELD — SUPPORT ANY FILE TYPE
#     exam_file = models.FileField(upload_to="exam_files/", blank=True, null=True)

#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     created = models.DateTimeField(auto_now_add=True)
