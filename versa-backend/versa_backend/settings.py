
from datetime import timedelta
from pathlib import Path
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qsl

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = os.getenv(
    'SECRET_KEY', '53x(p6us883v2395pr%fp@i_f1yftel=1f%$lio(n_7n$1zo^s'
)
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']

# Disable automatic slash redirect to avoid POST issues
APPEND_SLASH = False

# Installed apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'graphene_django',
    'corsheaders',
    'rest_framework',
    'auth_app',
    'social_django',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://versa-pink.vercel.app',
]

# URL configuration
ROOT_URLCONF = 'versa_backend.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'versa_backend.wsgi.application'

# Database
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql://neondb_owner:npg_N0tZOFS6jmdc@ep-divine-field-adffnrkp-pooler.c-2.us-east-1.aws.neon.tech/versa-database?sslmode=require&channel_binding=require'
)
parsed_url = urlparse(DATABASE_URL)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': parsed_url.path[1:],
        'USER': parsed_url.username,
        'PASSWORD': parsed_url.password,
        'HOST': parsed_url.hostname,
        'PORT': parsed_url.port or 5432,
        'OPTIONS': dict(parse_qsl(parsed_url.query)),
    }
}

# Custom User Model
AUTH_USER_MODEL = 'auth_app.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Graphene
GRAPHENE = {
    'SCHEMA': 'auth_app.schema.schema',
    'MIDDLEWARE': ['graphene_django.debug.DjangoDebugMiddleware'],
}

# JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'SIGNING_KEY': "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww",
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Social Auth Settings
AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = "1077311579805-n1fonddbo5e2jnbhae0j6fesps5d6nv1.apps.googleusercontent.com"
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = "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"

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'auth_app.pipeline.create_or_get_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
)

# Login redirect URLs
LOGIN_URL = '/login'
LOGOUT_URL = '/logout'
SOCIAL_AUTH_LOGIN_REDIRECT_URL = 'https://versa-pink.vercel.app/callback'
SOCIAL_AUTH_LOGIN_ERROR_URL = 'https://versa-pink.vercel.app/login'
SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI = 'https://versa-api-f9sl.onrender.com/auth/complete/google-oauth2/'
