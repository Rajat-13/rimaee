"""
Accounts Views - API endpoints
MVVM: View Layer (Controllers)
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Count, Sum
from .models import User, UserRole, Address
from .serializers import (
    UserSerializer, UserRegistrationSerializer, 
    CustomTokenObtainPairSerializer, AddressSerializer,
    CustomerListSerializer
)


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    """Login with JWT tokens."""
    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get/update current user profile."""
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class AddressListCreateView(generics.ListCreateAPIView):
    """List and create addresses for current user."""
    serializer_class = AddressSerializer
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # If first address, make it default
        if not Address.objects.filter(user=self.request.user).exists():
            serializer.save(user=self.request.user, is_default=True)
        else:
            serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get/update/delete a specific address."""
    serializer_class = AddressSerializer
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


# ============ ADMIN ENDPOINTS ============

class IsAdmin(permissions.BasePermission):
    """Check if user has admin role."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return UserRole.objects.filter(user=request.user, role='admin').exists()


class CustomerListView(generics.ListAPIView):
    """Admin: List all customers with stats."""
    serializer_class = CustomerListSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['is_active', 'city', 'state']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering_fields = ['created_at', 'total_orders', 'total_spent']
    
    def get_queryset(self):
        return User.objects.annotate(
            total_orders=Count('orders'),
            total_spent=Sum('orders__total_amount')
        ).filter(roles__role='user')


class CustomerDetailView(generics.RetrieveUpdateAPIView):
    """Admin: Get/update customer details."""
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all()


class CustomerActivityView(APIView):
    """Admin: Get customer's recent activity."""
    permission_classes = [IsAdmin]
    
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        from apps.reviews.models import Review
        from apps.products.models import ProductView
        
        recent_views = ProductView.objects.filter(user=user).order_by('-viewed_at')[:10]
        recent_reviews = Review.objects.filter(user=user).order_by('-created_at')[:10]
        
        return Response({
            'viewed_products': [
                {'product_id': v.product_id, 'product_name': v.product.name, 'viewed_at': v.viewed_at}
                for v in recent_views
            ],
            'reviews': [
                {'product_id': r.product_id, 'rating': r.rating, 'comment': r.comment, 'created_at': r.created_at}
                for r in recent_reviews
            ]
        })
