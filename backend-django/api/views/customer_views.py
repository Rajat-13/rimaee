"""
Customer Views (Admin)
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import User, Order
from ..viewmodels import UserSerializer, OrderListSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    """
    GET    /customers/              - List all customers
    GET    /customers/<id>/         - Get customer details
    GET    /customers/<id>/orders/  - Get customer orders
    PUT    /customers/<id>/status/  - Update customer status
    """
    queryset = User.objects.filter(role='customer')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'is_phone_verified', 'is_email_verified']
    search_fields = ['phone', 'email', 'full_name', 'username']
    ordering_fields = ['created_at', 'full_name']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        """GET /customers/<id>/orders/ - Get customer orders"""
        customer = self.get_object()
        orders = Order.objects.filter(user=customer)
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['put'])
    def status(self, request, pk=None):
        """PUT /customers/<id>/status/ - Update status"""
        customer = self.get_object()
        is_active = request.data.get('is_active')
        
        if is_active is not None:
            customer.is_active = is_active
            customer.save()
        
        return Response(UserSerializer(customer).data)
