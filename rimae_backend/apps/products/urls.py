"""
Products URL Configuration
"""
from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView,
    RecordProductView, RecentlyViewedView,
    AdminProductListView, AdminProductDetailView, AdminProductImageUpload,
    AdminVariantListView, AdminCategoryListView, AdminCategoryDetailView,
    AdminIngredientListView, AdminIngredientDetailView
)

urlpatterns = [
    # Public
    path('', ProductListView.as_view(), name='product-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('<uuid:product_id>/view/', RecordProductView.as_view(), name='record-view'),
    path('user/recently-viewed/', RecentlyViewedView.as_view(), name='recently-viewed'),
    
    # Admin
    path('admin/list/', AdminProductListView.as_view(), name='admin-product-list'),
    path('admin/<uuid:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('admin/<uuid:product_id>/images/', AdminProductImageUpload.as_view(), name='admin-product-images'),
    path('admin/<uuid:product_id>/variants/', AdminVariantListView.as_view(), name='admin-variants'),
    path('admin/categories/', AdminCategoryListView.as_view(), name='admin-categories'),
    path('admin/categories/<uuid:pk>/', AdminCategoryDetailView.as_view(), name='admin-category-detail'),
    path('admin/ingredients/', AdminIngredientListView.as_view(), name='admin-ingredients'),
    path('admin/ingredients/<uuid:pk>/', AdminIngredientDetailView.as_view(), name='admin-ingredient-detail'),
]
