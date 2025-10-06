
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
        creditsUsed = graphene.Int(default_value=10)

    Output = PostPayload

    def mutate(self, info: GraphQLResolveInfo, content: str, creditsUsed: int) -> PostPayload:
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

        if user.credits < creditsUsed:
            raise ValidationError("Insufficient credits")

        user.credits -= creditsUsed
        user.save()

        post = Post.objects.create(
            user=user, content=content, credits_used=creditsUsed)

        return PostPayload(post=post, user=user)


class EditPostMutation(graphene.Mutation):
    class Arguments:
        postId = graphene.ID(required=True)
        content = graphene.String(required=True)

    Output = PostPayload

    def mutate(self, info: GraphQLResolveInfo, postId: str, content: str) -> PostPayload:
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

        try:
            post = Post.objects.get(id=postId)
        except Post.DoesNotExist:
            raise ValidationError("Post not found")

        if post.user != user and user.role != 'ADMIN':
            raise ValidationError("You can only edit your own posts")

        post.content = content
        post.save()

        return PostPayload(post=post, user=user)


class DeletePostMutation(graphene.Mutation):
    class Arguments:
        postId = graphene.ID(required=True)

    Output = PostPayload

    def mutate(self, info: GraphQLResolveInfo, postId: str) -> PostPayload:
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

        try:
            post = Post.objects.get(id=postId)
        except Post.DoesNotExist:
            raise ValidationError("Post not found")

        if post.user != user and user.role != 'ADMIN':
            raise ValidationError("You can only delete your own posts")

        credits_to_refund = post.credits_used
        post_user = post.user
        post_user.credits += credits_to_refund
        post_user.save()

        post.delete()

        return PostPayload(post=None, user=post_user)

# --------------------------
# Query
# --------------------------


class MeQuery(graphene.ObjectType):
    me = graphene.Field(UserType)
    posts = graphene.List(PostType)
    allPosts = graphene.List(PostType)

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

    def resolve_posts(self, info: GraphQLResolveInfo):
        auth_header = info.context.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            raise ValidationError("No token provided")
        token = auth_header.replace("Bearer ", "")
        try:
            payload = jwt.decode(
                token, "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww", algorithms=["HS256"])
            user_id = payload["userId"]
            user = User.objects.get(id=user_id)
            return Post.objects.filter(user=user)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
            raise ValidationError("Invalid or expired token")

    def resolve_allPosts(self, info: GraphQLResolveInfo):
        auth_header = info.context.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            raise ValidationError("No token provided")
        token = auth_header.replace("Bearer ", "")
        try:
            payload = jwt.decode(
                token, "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww", algorithms=["HS256"])
            user_id = payload["userId"]
            user = User.objects.get(id=user_id)
            if user.role != 'ADMIN':
                raise ValidationError("Only admins can view all posts")
            return Post.objects.all()
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
            raise ValidationError("Invalid or expired token")


class Query(MeQuery, graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    register = RegisterMutation.Field()
    login = LoginMutation.Field()
    create_post = CreatePostMutation.Field()
    edit_post = EditPostMutation.Field()
    delete_post = DeletePostMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
