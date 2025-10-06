from social_core.pipeline.user import create_user
from auth_app.models import User


def create_or_get_user(backend, details, user=None, *args, **kwargs):
    """Custom pipeline to create or get user with credits."""
    if user:
        return {'is_new': False}

    # Get or create user
    email = details.get('email')
    try:
        user = User.objects.get(email=email)
        return {'is_new': False, 'user': user}
    except User.DoesNotExist:
        # Create new user with 100 credits
        user = User.objects.create_user(
            email=email,
            password=None,  # No password for OAuth users
            credits=100,
            role='USER'
        )
        return {'is_new': True, 'user': user}
