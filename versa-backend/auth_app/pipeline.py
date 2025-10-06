from auth_app.models import User


def create_or_get_user(backend, details, user=None, *args, **kwargs):
    """
    Custom pipeline to create or get a user with default credits for OAuth logins.
    Ensures the returned 'user' is a Django User instance.
    """
    if user:
        return {'is_new': False, 'user': user}  # Always return 'user'

    email = details.get('email')
    if not email:
        return None  # Cannot create user without email

    # Try to get existing user
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'credits': 100,
            'role': 'USER',
            'username': email.split('@')[0],  # Required if using AbstractUser
            'password': None  # OAuth users won't have a password
        }
    )

    return {'is_new': created, 'user': user}
