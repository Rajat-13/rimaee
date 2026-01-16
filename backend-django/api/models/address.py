"""
Address Model
"""
from django.db import models
from django.conf import settings


class Address(models.Model):
    TYPE_CHOICES = [
        ('home', 'Home'),
        ('office', 'Office'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='addresses')
    
    label = models.CharField(max_length=50, blank=True)  # e.g., "Home", "Office"
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='home')
    
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    
    address_line1 = models.CharField(max_length=500)
    address_line2 = models.CharField(max_length=500, blank=True)
    landmark = models.CharField(max_length=200, blank=True)
    
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='India')
    
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'addresses'
        ordering = ['-is_default', '-created_at']
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return f"{self.full_name} - {self.city}"

    def save(self, *args, **kwargs):
        # If this is set as default, remove default from other addresses
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)

    @property
    def full_address(self):
        parts = [self.address_line1]
        if self.address_line2:
            parts.append(self.address_line2)
        if self.landmark:
            parts.append(f"Near {self.landmark}")
        parts.append(f"{self.city}, {self.state} - {self.pincode}")
        return ", ".join(parts)
