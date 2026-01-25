"""
Orders Models - Order management with Unit Economics
MVVM: Model Layer
"""
from django.db import models
import uuid
from decimal import Decimal


class Order(models.Model):
    """Order with full unit economics tracking."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('returned', 'Returned'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='orders')
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    
    # Pricing - Revenue
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_charged = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Unit Economics - Costs
    cogs = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Cost of Goods Sold
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Actual shipping cost
    packaging_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_gateway_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cac = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Customer Acquisition Cost
    
    # Computed profit
    @property
    def gross_profit(self):
        return self.total_amount - self.cogs
    
    @property
    def net_profit(self):
        total_costs = self.cogs + self.shipping_cost + self.packaging_cost + self.payment_gateway_fee + self.cac
        return self.total_amount - total_costs
    
    @property
    def profit_margin(self):
        if self.total_amount > 0:
            return (self.net_profit / self.total_amount) * 100
        return Decimal('0')
    
    # Shipping Address
    shipping_name = models.CharField(max_length=100)
    shipping_phone = models.CharField(max_length=15)
    shipping_address1 = models.CharField(max_length=255)
    shipping_address2 = models.CharField(max_length=255, blank=True)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_pincode = models.CharField(max_length=10)
    
    # Payment
    payment_method = models.CharField(max_length=50, blank=True)
    payment_id = models.CharField(max_length=100, blank=True)
    
    # Coupon
    coupon = models.ForeignKey('Coupon', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Notes
    customer_notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            from datetime import datetime
            self.order_number = f"ORD{datetime.now().strftime('%Y%m%d%H%M%S')}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Order line items with cost tracking."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.SET_NULL, null=True, related_name='order_items')
    variant = models.ForeignKey('products.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True)
    
    product_name = models.CharField(max_length=200)
    variant_name = models.CharField(max_length=100, blank=True)
    sku = models.CharField(max_length=50)
    
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # COGS per unit
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'


class Coupon(models.Model):
    """Discount coupons."""
    DISCOUNT_TYPES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'coupons'


class Cart(models.Model):
    """User shopping cart."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'carts'


class CartItem(models.Model):
    """Cart line items."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    variant = models.ForeignKey('products.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cart_items'
        unique_together = ['cart', 'product', 'variant']


class Wishlist(models.Model):
    """User wishlist."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'wishlist'
        unique_together = ['user', 'product']
