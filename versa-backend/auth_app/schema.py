import os
import jwt
from datetime import datetime, timedelta
import graphene
from graphene_django.types import DjangoObjectType
from graphql import GraphQLResolveInfo
from django.core.exceptions import ValidationError
from auth_app.models import User
from social_django.utils import load_strategy, load_backend
from social_core.actions import do_complete


# --------------------------
# Graphene Types
# --------------------------
class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "email", "credits", "role")

    # Ensure the role is returned as a string for GraphQL enum
    role = graphene.Field(lambda: RoleEnum)

    def resolve_role(self, info):
        return str(self.role)


# Graphene enum matching the string values in the model
class RoleEnum(graphene.Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class AuthPayload(graphene.ObjectType):
    token = graphene.String()
    user = graphene.Field(UserType)


# --------------------------
# Mutations
# --------------------------
class RegisterMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    Output = AuthPayload

    def mutate(self, info: GraphQLResolveInfo, email: str, password: str) -> AuthPayload:
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already in use")

        user = User.objects.create_user(email=email, password=password)

        token = jwt.encode(
            {
                "userId": str(user.id),
                "exp": int((datetime.utcnow() + timedelta(days=7)).timestamp()),
            },
            "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww",
            algorithm="HS256",
        )
        return AuthPayload(token=token, user=user)


class LoginMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    Output = AuthPayload

    def mutate(self, info: GraphQLResolveInfo, email: str, password: str) -> AuthPayload:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise ValidationError("User not found")

        if not user.check_password(password):
            raise ValidationError("Invalid password")

        token = jwt.encode(
            {
                "userId": str(user.id),
                "exp": int((datetime.utcnow() + timedelta(days=7)).timestamp()),
            },
            "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww",
            algorithm="HS256",
        )
        return AuthPayload(token=token, user=user)


# --------------------------
# Query
# --------------------------
class MeQuery(graphene.ObjectType):
    me = graphene.Field(UserType)

    def resolve_me(self, info: GraphQLResolveInfo) -> User:
        auth_header = info.context.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            raise ValidationError("No token provided")
        token = auth_header.replace("Bearer ", "")
        try:
            payload = jwt.decode(
                token, "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww", algorithms=["HS256"])
            user_id = payload["userId"]
            return User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            raise ValidationError("Token expired")
        except jwt.InvalidTokenError:
            raise ValidationError("Invalid token")
        except User.DoesNotExist:
            raise ValidationError("User not found")


class Query(MeQuery, graphene.ObjectType):
    pass


class GoogleOAuthMutation(graphene.Mutation):
    class Arguments:
        code = graphene.String(required=True)  # Google auth code

    Output = AuthPayload

    def mutate(self, info: GraphQLResolveInfo, code: str) -> AuthPayload:
        try:
            # Get strategy and backend
            strategy = load_strategy(request=info.context)
            backend = load_backend(
                strategy, 'google-oauth2', redirect_uri=None)

            # Complete OAuth flow
            user = do_complete(
                backend,
                code=code,
                user=None,
                strategy=strategy,
                redirect_name='next',
                redirect_uri='https://versa-pink.vercel.app/callback'  # Frontend callback
            )

            if not user or not user.is_active:
                raise ValidationError("Google authentication failed")

            # Generate JWT token
            token = jwt.encode(
                {
                    "userId": str(user.id),
                    "exp": int((datetime.utcnow() + timedelta(days=7)).timestamp()),
                },
                "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww",
                algorithm="HS256",
            )

            return AuthPayload(token=token, user=user)
        except Exception as e:
            raise ValidationError(f"Google OAuth failed: {str(e)}")


class Mutation(graphene.ObjectType):
    register = RegisterMutation.Field()
    login = LoginMutation.Field()
    googleOAuth = GoogleOAuthMutation.Field()


# --------------------------
# Schema
# --------------------------
schema = graphene.Schema(query=Query, mutation=Mutation)
