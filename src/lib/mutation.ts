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
    credits_used: number;
    created_at: string;
    updated_at: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface PostResponse {
    post: Post;
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
    credits_used: number = 10
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
              credits_used
              created_at
              updated_at
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
            variables: { content, creditsUsed: credits_used },
        }),
    });

    const result: GraphQLResponse<{ createPost: PostResponse }> =
        await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data!.createPost;
};
