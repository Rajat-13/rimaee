"""
Main URL Configuration for RIMAE Backend
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="RIMAE API",
        default_version='v1',
        description="API for RIMAE Perfume Store",
        contact=openapi.Contact(email="contact@rimae.com"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1 routes
    path('api/v1/', include([
        path('auth/', include('apps.accounts.urls')),
        path('products/', include('apps.products.urls')),
        path('orders/', include('apps.orders.urls')),
        path('inventory/', include('apps.inventory.urls')),
        path('reviews/', include('apps.reviews.urls')),
        path('assets/', include('apps.assets.urls')),
        path('analytics/', include('apps.analytics.urls')),
        path('notifications/', include('apps.notifications.urls')),
        path('accessories/', include('apps.accessories.urls')),
    ])),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
