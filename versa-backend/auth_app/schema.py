
import os
import jwt
from datetime import datetime, timedelta
import graphene
from graphene_django.types import DjangoObjectType
from graphql import GraphQLResolveInfo
from django.core.exceptions import ValidationError
from auth_app.models import User, Post

# --------------------------
# Graphene Types
# --------------------------


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "email", "credits", "role")

    role = graphene.Field(lambda: RoleEnum)

    def resolve_role(self, info):
        return str(self.role)


class RoleEnum(graphene.Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ("id", "user", "content", "credits_used",
                  "created_at", "updated_at")


class AuthPayload(graphene.ObjectType):
    token = graphene.String()
    user = graphene.Field(UserType)


class PostPayload(graphene.ObjectType):
    post = graphene.Field(PostType)
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


class CreatePostMutation(graphene.Mutation):
    class Arguments:
        content = graphene.String(required=True)
        credits_used = graphene.Int(default_value=10)

    Output = PostPayload

    def mutate(self, info: GraphQLResolveInfo, content: str, credits_used: int) -> PostPayload:
        auth_header = info.context.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            raise ValidationError("No token provided")
        token = auth_header.replace("Bearer ", "")
        try:
            payload = jwt.decode(
                token, "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww", algorithms=["HS256"])
            user_id = payload["userId"]
            user = User.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
            raise ValidationError("Invalid or expired token")

        if user.credits < credits_used:
            raise ValidationError("Insufficient credits")

        user.credits -= credits_used
        user.save()

        post = Post.objects.create(
            user=user, content=content, credits_used=credits_used)

        return PostPayload(post=post, user=user)

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


class Mutation(graphene.ObjectType):
    register = RegisterMutation.Field()
    login = LoginMutation.Field()
    create_post = CreatePostMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
