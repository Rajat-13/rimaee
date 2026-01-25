from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.views import IsAdmin
from apps.orders.models import Order
from apps.products.models import Product
from apps.accounts.models import User
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth, TruncDay

class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request):
        from django.utils import timezone
        from datetime import timedelta
        today = timezone.now().date()
        
        return Response({
            'total_revenue': float(Order.objects.filter(status='delivered').aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
            'total_orders': Order.objects.count(),
            'total_customers': User.objects.filter(roles__role='user').count(),
            'total_products': Product.objects.filter(is_active=True).count(),
        })

class SalesAnalyticsView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request):
        monthly = Order.objects.filter(status='delivered').annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            revenue=Sum('total_amount'),
            orders=Count('id'),
            profit=Sum('total_amount') - Sum('cogs')
        ).order_by('month')
        return Response(list(monthly))

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view()),
    path('sales/', SalesAnalyticsView.as_view()),
]
