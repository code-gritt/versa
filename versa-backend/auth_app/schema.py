import os
import jwt
from datetime import datetime, timedelta
import graphene
from graphene_django.types import DjangoObjectType
from graphql import GraphQLResolveInfo
from django.core.exceptions import ValidationError
from auth_app.models import User, Role


# --------------------------
# Graphene Types
# --------------------------
class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "email", "credits", "role")


# Map Django Role enum to Graphene enum using string values
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

        # Create user using Django-compatible method
        user = User.objects.create_user(email=email, password=password)

        token = jwt.encode(
            {
                "userId": str(user.id),
                "exp": int((datetime.utcnow() + timedelta(days=7)).timestamp()),
            },
            os.getenv("JWT_SECRET"),
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
            os.getenv("JWT_SECRET"),
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
            payload = jwt.decode(token, os.getenv(
                "JWT_SECRET"), algorithms=["HS256"])
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


class Mutation(graphene.ObjectType):
    register = RegisterMutation.Field()
    login = LoginMutation.Field()


# --------------------------
# Schema
# --------------------------
schema = graphene.Schema(query=Query, mutation=Mutation)
