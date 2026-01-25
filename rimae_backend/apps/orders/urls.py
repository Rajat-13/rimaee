"""
Orders URL Configuration
"""
from django.urls import path
from .views import (
    CartView, CartAddItem, CartUpdateItem, CartRemoveItem,
    WishlistView, WishlistRemove,
    UserOrderListView, UserOrderDetailView, CreateOrderView, ApplyCouponView,
    AdminOrderListView, AdminOrderDetailView,
    AdminCouponListView, AdminCouponDetailView, UnitEconomicsView
)

urlpatterns = [
    # Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', CartAddItem.as_view(), name='cart-add'),
    path('cart/update/<uuid:item_id>/', CartUpdateItem.as_view(), name='cart-update'),
    path('cart/remove/<uuid:item_id>/', CartRemoveItem.as_view(), name='cart-remove'),
    
    # Wishlist
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/remove/<uuid:product_id>/', WishlistRemove.as_view(), name='wishlist-remove'),
    
    # User orders
    path('', UserOrderListView.as_view(), name='order-list'),
    path('<uuid:pk>/', UserOrderDetailView.as_view(), name='order-detail'),
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('apply-coupon/', ApplyCouponView.as_view(), name='apply-coupon'),
    
    # Admin
    path('admin/list/', AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/<uuid:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/coupons/', AdminCouponListView.as_view(), name='admin-coupons'),
    path('admin/coupons/<uuid:pk>/', AdminCouponDetailView.as_view(), name='admin-coupon-detail'),
    path('admin/unit-economics/', UnitEconomicsView.as_view(), name='unit-economics'),
]
