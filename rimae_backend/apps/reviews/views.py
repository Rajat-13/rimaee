from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
from apps.accounts.views import IsAdmin

class ProductReviewsView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_id'], status='approved')
    
    def perform_create(self, serializer):
        from apps.orders.models import OrderItem
        is_verified = OrderItem.objects.filter(
            order__user=self.request.user, product_id=self.kwargs['product_id']
        ).exists()
        serializer.save(user=self.request.user, product_id=self.kwargs['product_id'], is_verified_purchase=is_verified)

class AdminReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdmin]
    queryset = Review.objects.all()
    filterset_fields = ['status', 'rating']

class AdminReviewActionView(APIView):
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        review = Review.objects.get(pk=pk)
        action = request.data.get('action')
        if action == 'approve':
            review.status = 'approved'
        elif action == 'reject':
            review.status = 'rejected'
        elif action == 'reply':
            review.admin_reply = request.data.get('reply', '')
        review.save()
        return Response(ReviewSerializer(review).data)
