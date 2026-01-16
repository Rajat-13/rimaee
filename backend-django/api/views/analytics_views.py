"""
Analytics Views (Admin)
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from ..models import Order, Product, User, Payment


class AnalyticsView(APIView):
    """
    GET /analytics/dashboard/ - Get dashboard stats
    GET /analytics/sales/     - Get sales analytics
    GET /analytics/products/  - Get product analytics
    GET /analytics/customers/ - Get customer analytics
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        path = request.path
        
        if 'sales' in path:
            return self.get_sales_analytics()
        elif 'products' in path:
            return self.get_product_analytics()
        elif 'customers' in path:
            return self.get_customer_analytics()
        else:
            return self.get_dashboard_stats()

    def get_dashboard_stats(self):
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)
        
        # Order stats
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        
        # Revenue
        total_revenue = Order.objects.filter(
            payment_status='paid'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        monthly_revenue = Order.objects.filter(
            payment_status='paid',
            created_at__date__gte=last_30_days
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Customers
        total_customers = User.objects.filter(role='customer').count()
        new_customers = User.objects.filter(
            role='customer',
            created_at__date__gte=last_30_days
        ).count()
        
        # Products
        total_products = Product.objects.filter(is_active=True).count()
        low_stock = Product.objects.filter(
            is_active=True,
            stock_quantity__lte=10
        ).count()
        
        return Response({
            'orders': {
                'total': total_orders,
                'pending': pending_orders,
            },
            'revenue': {
                'total': float(total_revenue),
                'monthly': float(monthly_revenue),
            },
            'customers': {
                'total': total_customers,
                'new': new_customers,
            },
            'products': {
                'total': total_products,
                'low_stock': low_stock,
            }
        })

    def get_sales_analytics(self):
        # Monthly sales for last 6 months
        six_months_ago = timezone.now() - timedelta(days=180)
        
        monthly_sales = Order.objects.filter(
            payment_status='paid',
            created_at__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Sum('total_amount'),
            count=Count('id')
        ).order_by('month')
        
        return Response({
            'monthly_sales': list(monthly_sales)
        })

    def get_product_analytics(self):
        # Top selling products
        from ..models import OrderItem
        
        top_products = OrderItem.objects.values(
            'product__name'
        ).annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('total_price')
        ).order_by('-total_sold')[:10]
        
        # Category distribution
        category_stats = Product.objects.values(
            'category__name'
        ).annotate(
            count=Count('id')
        )
        
        return Response({
            'top_products': list(top_products),
            'category_distribution': list(category_stats)
        })

    def get_customer_analytics(self):
        # Customer retention
        total = User.objects.filter(role='customer').count()
        with_orders = User.objects.filter(
            role='customer',
            orders__isnull=False
        ).distinct().count()
        
        repeat_customers = User.objects.filter(
            role='customer'
        ).annotate(
            order_count=Count('orders')
        ).filter(order_count__gte=2).count()
        
        return Response({
            'total_customers': total,
            'customers_with_orders': with_orders,
            'repeat_customers': repeat_customers,
            'conversion_rate': round(with_orders / total * 100, 2) if total > 0 else 0,
            'retention_rate': round(repeat_customers / with_orders * 100, 2) if with_orders > 0 else 0
        })
