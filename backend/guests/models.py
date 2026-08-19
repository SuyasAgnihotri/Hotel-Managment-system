import uuid
from django.db import models

class Guest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20)
    id_proof_type = models.CharField(max_length=30, blank=True)   # "aadhaar", "passport"
    id_proof_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["phone"])]


    def __str__(self):
        return f"{self.full_name} ({self.phone})"