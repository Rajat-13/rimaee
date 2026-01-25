"""Asset Management Models"""
from django.db import models
import uuid

class Asset(models.Model):
    ASSET_TYPES = [('image', 'Image'), ('video', 'Video'), ('document', 'Document')]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='assets/')
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES)
    alt_text = models.CharField(max_length=255, blank=True)
    folder = models.CharField(max_length=100, default='general')
    file_size = models.PositiveIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True)
    used_in = models.JSONField(default=list)  # Track where asset is used
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assets'
