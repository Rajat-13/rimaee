from django.db import models

class Product(models.Model):
    TYPE_CHOICES = [('perfume', 'Perfume'), ('attar', 'Attar')]
    TAG_CHOICES = [('Bestseller', 'Bestseller'), ('Sale', 'Sale'), ('New', 'New')]

    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.CharField(max_length=100)
    gender = models.CharField(max_length=50)
    
    # Media
    image = models.URLField(max_length=500) # Main Image
    additional_images = models.JSONField(default=list) # List of 3 URLs
    
    # Stats & Settings
    stock_id = models.IntegerField(default=0)
    max_order_threshold = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, null=True, blank=True)
    occasion = models.CharField(max_length=255, null=True, blank=True)
    
    # Complex Data (Stored as JSON)
    variants = models.JSONField() # Stores size, mrp, discount, price
    concentration = models.JSONField(default=dict) # Stores sillage, projection, longevity
    notes = models.JSONField(default=dict) # Stores top, middle, base lists
    
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name