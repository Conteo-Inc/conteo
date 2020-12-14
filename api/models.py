from django.db import models

# Create your models here.
class Video(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True)