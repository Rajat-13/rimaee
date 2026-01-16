"""
Notification Model
"""
from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = [
        ('order', 'Order Update'),
        ('promo', 'Promotion'),
        ('system', 'System'),
        ('feedback', 'Customer Feedback'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        null=True, 
        blank=True  # Null for broadcast notifications
    )
    
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='system')
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    is_broadcast = models.BooleanField(default=False)
    
    metadata = models.JSONField(default=dict, blank=True)  # Extra data like order_id, etc.
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type}: {self.title}"
