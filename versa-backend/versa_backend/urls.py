from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from auth_app.schema import schema
from auth_app.views import google_oauth_callback

urlpatterns = [
    path('admin/', admin.site.urls),
    # CSRF exempt for GraphQL endpoint
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
    # Social Auth URLs
    path('auth/', include('social_django.urls', namespace='social')),
    path('auth/complete/google-oauth2/',
         google_oauth_callback, name='google_oauth_callback'),
]
