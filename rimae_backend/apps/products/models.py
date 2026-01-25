"""
Products Models - Fragrances & Accessories
MVVM: Model Layer
"""
from django.db import models
import uuid


class Category(models.Model):
    """Product categories."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        ordering = ['sort_order', 'name']
        verbose_name_plural = 'Categories'


class Product(models.Model):
    """Main product model for fragrances and accessories."""
    PRODUCT_TYPES = [
        ('fragrance', 'Fragrance'),
        ('accessory', 'Accessory'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default='fragrance')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex')
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # For COGS calculation
    
    # Fragrance specific
    concentration = models.CharField(max_length=50, blank=True)  # EDP, EDT, etc.
    top_notes = models.CharField(max_length=255, blank=True)
    middle_notes = models.CharField(max_length=255, blank=True)
    base_notes = models.CharField(max_length=255, blank=True)
    longevity = models.CharField(max_length=50, blank=True)
    sillage = models.CharField(max_length=50, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    
    # SEO
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']


class ProductVariant(models.Model):
    """Product variants (sizes, etc.)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)  # e.g., "50ml", "100ml"
    size = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'product_variants'
        ordering = ['sort_order']


class ProductImage(models.Model):
    """Product images."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'product_images'
        ordering = ['sort_order']


class Ingredient(models.Model):
    """Fragrance ingredients for custom perfumes."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    note_type = models.CharField(max_length=20, choices=[
        ('top', 'Top Note'),
        ('middle', 'Middle Note'),
        ('base', 'Base Note'),
    ])
    family = models.CharField(max_length=50, blank=True)  # Floral, Woody, etc.
    cost_per_unit = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'ingredients'


class ProductView(models.Model):
    """Track product views for recently viewed."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='product_views')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='views')
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'product_views'
        unique_together = ['user', 'product']
        ordering = ['-viewed_at']
