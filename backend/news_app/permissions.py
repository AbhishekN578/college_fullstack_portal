from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrAdmin(BasePermission):
    """
    Only owner OR admin can update/delete posts.
    Everyone can read (GET).
    """
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        
        # Allow DELETE/PUT/PATCH only to:
        # Post owner, admin staff, superuser
        return (
            obj.author == request.user or
            request.user.is_staff or
            request.user.is_superuser
        )
