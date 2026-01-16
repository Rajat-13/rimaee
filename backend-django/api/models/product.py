"""
Product Model
"""
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    TYPE_CHOICES = [
        ('perfume', 'Perfume'),
        ('attar', 'Attar'),
    ]

    CONCENTRATION_CHOICES = [
        ('parfum', 'Parfum'),
        ('edp', 'Eau de Parfum'),
        ('edt', 'Eau de Toilette'),
        ('edc', 'Eau de Cologne'),
    ]

    GENDER_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='perfume')
    sku = models.CharField(max_length=50, unique=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='unisex')
    concentration = models.CharField(max_length=20, choices=CONCENTRATION_CHOICES, blank=True)
    
    stock_quantity = models.IntegerField(default=0)
    min_order_threshold = models.IntegerField(default=10)
    watching_count = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    is_bestseller = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Fragrance notes
    top_notes = models.JSONField(default=list, blank=True)
    middle_notes = models.JSONField(default=list, blank=True)
    base_notes = models.JSONField(default=list, blank=True)
    
    # Meta
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def final_price(self):
        if self.discount > 0:
            return self.price - (self.price * self.discount / 100)
        return self.price

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.min_order_threshold


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_cover = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_images'
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.product.name}"
