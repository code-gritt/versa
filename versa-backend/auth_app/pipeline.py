
from auth_app.models import User


def create_or_get_user(backend, details, response, user=None, *args, **kwargs):
    """
    Custom pipeline to create or get a user with default credits for OAuth logins.
    Ensures the returned 'user' is a Django User instance compatible with social-auth.
    """
    if user and user.is_active:
        return {'is_new': False, 'user': user}

    email = details.get('email')
    if not email:
        raise ValueError("Email is required for Google OAuth")

    # Get or create user with defaults
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'credits': 100,
            'role': 'USER',
            # Required for AbstractUser compatibility
            'username': email.split('@')[0],
        }
    )

    # Ensure credits are set for existing users without credits
    if not created and user.credits == 0:
        user.credits = 100
        user.save()

    return {'is_new': created, 'user': user}
