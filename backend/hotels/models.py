import uuid
from django.db import models

class Hotel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)  # used in subdomains/URLs later
    city = models.CharField(max_length=100)
    timezone = models.CharField(max_length=50, default="Asia/Kolkata")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name