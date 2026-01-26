import uuid
import os
from django.db import models

class Asset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='assets/') # Stores in folder
    asset_type = models.CharField(max_length=20)
    alt_text = models.CharField(max_length=255, null=True, blank=True)
    folder = models.CharField(max_length=100, default='default')
    file_size = models.IntegerField() # Store in bytes for calculation
    mime_type = models.CharField(max_length=100)
    used_in = models.JSONField(default=list) # Maps to jsonb
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'asset'

    def __str__(self):
        return self.name