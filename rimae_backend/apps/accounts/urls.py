"""
Accounts URL Configuration
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, CustomTokenObtainPairView, ProfileView,
    AddressListCreateView, AddressDetailView,
    CustomerListView, CustomerDetailView, CustomerActivityView
)

urlpatterns = [
    # Public auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list'),
    path('addresses/<uuid:pk>/', AddressDetailView.as_view(), name='address-detail'),
    
    # Admin endpoints
    path('admin/customers/', CustomerListView.as_view(), name='admin-customers'),
    path('admin/customers/<uuid:pk>/', CustomerDetailView.as_view(), name='admin-customer-detail'),
    path('admin/customers/<uuid:pk>/activity/', CustomerActivityView.as_view(), name='admin-customer-activity'),
]
