"""
Notification Views
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action

from ..models import Notification, User
from ..viewmodels import NotificationSerializer, BroadcastSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    GET    /notifications/           - List notifications
    POST   /notifications/broadcast/ - Send broadcast (Admin)
    PUT    /notifications/<id>/read/ - Mark as read
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get user-specific + broadcast notifications
        return Notification.objects.filter(
            user=user
        ) | Notification.objects.filter(
            is_broadcast=True
        )

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def broadcast(self, request):
        """POST /notifications/broadcast/ - Send to all users"""
        serializer = BroadcastSerializer(data=request.data)
        if serializer.is_valid():
            notification = Notification.objects.create(
                type=serializer.validated_data['type'],
                title=serializer.validated_data['title'],
                message=serializer.validated_data['message'],
                is_broadcast=True
            )
            return Response(
                NotificationSerializer(notification).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    def read(self, request, pk=None):
        """PUT /notifications/<id>/read/ - Mark as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['put'])
    def read_all(self, request):
        """PUT /notifications/read_all/ - Mark all as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
