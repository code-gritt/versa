import { useAuthStore } from "./store";

const API_URL = "https://versa-api-f9sl.onrender.com/graphql/";

interface User {
    id: string;
    email: string;
    credits: number;
    role: string;
}

interface Post {
    id: string;
    content: string;
    creditsUsed: number;
    createdAt: string;
    updatedAt: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface PostResponse {
    post: Post | null;
    user: User;
}

interface GraphQLResponse<T> {
    data?: T;
    errors?: { message: string }[];
}

export const register = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
        mutation Register($email: String!, $password: String!) {
          register(email: $email, password: $password) {
            token
            user {
              id
              email
              credits
              role
            }
          }
        }
      `,
            variables: { email, password },
        }),
    });

    const result: GraphQLResponse<{ register: AuthResponse }> =
        await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.register;
};

export const login = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              email
              credits
              role
            }
          }
        }
      `,
            variables: { email, password },
        }),
    });

    const result: GraphQLResponse<{ login: AuthResponse }> =
        await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.login;
};

export const me = async (): Promise<User> => {
    const token = useAuthStore.getState().token;
    if (!token) {
        throw new Error("No token provided");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `
        query Me {
          me {
            id
            email
            credits
            role
          }
        }
      `,
        }),
    });

    const result: GraphQLResponse<{ me: User }> = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.me;
};

export const createPost = async (
    content: string,
    creditsUsed: number = 10
): Promise<PostResponse> => {
    const token = useAuthStore.getState().token;
    if (!token) {
        throw new Error("No token provided");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `
        mutation CreatePost($content: String!, $creditsUsed: Int!) {
          createPost(content: $content, creditsUsed: $creditsUsed) {
            post {
              id
              content
              creditsUsed
              createdAt
              updatedAt
            }
            user {
              id
              email
              credits
              role
            }
          }
        }
      `,
            variables: { content, creditsUsed },
        }),
    });

    const result: GraphQLResponse<{ createPost: PostResponse }> =
        await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.createPost;
};

export const editPost = async (
    postId: string,
    content: string
): Promise<PostResponse> => {
    const token = useAuthStore.getState().token;
    if (!token) {
        throw new Error("No token provided");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `
        mutation EditPost($postId: ID!, $content: String!) {
          editPost(postId: $postId, content: $content) {
            post {
              id
              content
              creditsUsed
              createdAt
              updatedAt
            }
            user {
              id
              email
              credits
              role
            }
          }
        }
      `,
            variables: { postId, content },
        }),
    });

    const result: GraphQLResponse<{ editPost: PostResponse }> =
        await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.editPost;
};

export const deletePost = async (postId: string): Promise<PostResponse> => {
    const token = useAuthStore.getState().token;
    if (!token) {
        throw new Error("No token provided");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `
        mutation DeletePost($postId: ID!) {
          deletePost(postId: $postId) {
            post {
              id
              content
              creditsUsed
              createdAt
              updatedAt
            }
            user {
              id
              email
              credits
              role
            }
          }
        }
      `,
            variables: { postId },
        }),
    });

    const result: GraphQLResponse<{ deletePost: PostResponse }> =
        await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.deletePost;
};

export const getPosts = async (): Promise<Post[]> => {
    const token = useAuthStore.getState().token;
    if (!token) {
        throw new Error("No token provided");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `
        query Posts {
          posts {
            id
            content
            creditsUsed
            createdAt
            updatedAt
          }
        }
      `,
        }),
    });

    const result: GraphQLResponse<{ posts: Post[] }> = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.posts;
};

export const getAllPosts = async (): Promise<Post[]> => {
    const token = useAuthStore.getState().token;
    if (!token) {
        throw new Error("No token provided");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `
        query AllPosts {
          allPosts {
            id
            content
            creditsUsed
            createdAt
            updatedAt
            user {
              id
              email
            }
          }
        }
      `,
        }),
    });

    const result: GraphQLResponse<{ allPosts: Post[] }> = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.allPosts;
};
