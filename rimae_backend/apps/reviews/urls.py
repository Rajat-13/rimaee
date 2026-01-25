from django.urls import path
from .views import ProductReviewsView, AdminReviewListView, AdminReviewActionView

urlpatterns = [
    path('product/<uuid:product_id>/', ProductReviewsView.as_view()),
    path('admin/', AdminReviewListView.as_view()),
    path('admin/<uuid:pk>/action/', AdminReviewActionView.as_view()),
]
