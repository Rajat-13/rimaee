"""
Review Model
"""
from django.db import models
from django.conf import settings


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='reviews')
    
    rating = models.IntegerField()  # 1-5
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    
    helpful_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        unique_together = ['user', 'product']
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.phone} for {self.product.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update product rating
        self.product.update_rating()
