"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import {
    createPost,
    editPost,
    deletePost,
    getPosts,
    getAllPosts,
} from "@/lib/mutation";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import Tag from "@/components/Tag";
import Loader from "@/components/Loader";

interface Post {
    id: string;
    content: string;
    creditsUsed: number;
    createdAt: string;
    updatedAt: string;
    user?: { id: string; email: string };
}

export default function Dashboard() {
    const [content, setContent] = useState("");
    const [editPostId, setEditPostId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, setAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const fetchedPosts =
                    user?.role === "ADMIN"
                        ? await getAllPosts()
                        : await getPosts();
                setPosts(fetchedPosts);
            } catch (err: unknown) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch posts"
                );
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchPosts();
    }, [user]);

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { post, user: updatedUser } = await createPost(content);
            setAuth(updatedUser, useAuthStore.getState().token!);
            setContent("");
            setPosts([...posts, post!]);
            alert(`Post created! Credits used: ${post!.creditsUsed}`);
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Failed to create post"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEditPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editPostId) return;
        setError("");
        setLoading(true);
        try {
            const { post, user: updatedUser } = await editPost(
                editPostId,
                editContent
            );
            setAuth(updatedUser, useAuthStore.getState().token!);
            setPosts(posts.map((p) => (p.id === post!.id ? post! : p)));
            setEditPostId(null);
            setEditContent("");
            alert("Post updated!");
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Failed to update post"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        setError("");
        setLoading(true);
        try {
            const { user: updatedUser } = await deletePost(postId);
            setAuth(updatedUser, useAuthStore.getState().token!);
            setPosts(posts.filter((p) => p.id !== postId));
            alert("Post deleted and credits refunded!");
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Failed to delete post"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-neutral-950 min-h-screen relative">
            {loading && <Loader />}
            <div className="container max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center">
                        <Tag>Dashboard</Tag>
                    </div>
                    <h1 className="text-6xl font-medium text-center mt-6 text-white">
                        Welcome,{" "}
                        <span className="text-lime-400">{user.email}</span>
                    </h1>
                    <p className="text-center text-white/80 mt-4">
                        Available Credits: {user.credits}
                    </p>
                    <div className="max-w-md mx-auto mt-8 p-6 border border-white/15 rounded-[27px] bg-neutral-900/70 backdrop-blur">
                        <form
                            onSubmit={
                                editPostId ? handleEditPost : handleCreatePost
                            }
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    {editPostId
                                        ? "Edit Post Content"
                                        : "Post Content"}
                                </label>
                                <textarea
                                    value={editPostId ? editContent : content}
                                    onChange={(e) =>
                                        editPostId
                                            ? setEditContent(e.target.value)
                                            : setContent(e.target.value)
                                    }
                                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
                                    rows={5}
                                    required
                                    placeholder={
                                        editPostId
                                            ? "Edit your post content..."
                                            : "Enter your post content..."
                                    }
                                />
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={
                                    loading ||
                                    (!editPostId && user.credits < 10)
                                }
                            >
                                {loading
                                    ? editPostId
                                        ? "Updating Post..."
                                        : "Creating Post..."
                                    : editPostId
                                    ? "Update Post"
                                    : "Create Post (10 Credits)"}
                            </Button>
                            {editPostId && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full mt-4"
                                    onClick={() => {
                                        setEditPostId(null);
                                        setEditContent("");
                                    }}
                                >
                                    Cancel Edit
                                </Button>
                            )}
                        </form>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-medium text-white text-center">
                            {user.role === "ADMIN" ? "All Posts" : "Your Posts"}
                        </h2>
                        {posts.length === 0 ? (
                            <p className="text-center text-white/50 mt-4">
                                No posts yet.
                            </p>
                        ) : (
                            <div className="grid gap-4 mt-4">
                                {posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="p-4 border border-white/15 rounded-lg bg-neutral-900/70"
                                    >
                                        <p className="text-white">
                                            {post.content}
                                        </p>
                                        <p className="text-white/50 text-sm mt-2">
                                            Credits Used: {post.creditsUsed} |
                                            Created:{" "}
                                            {new Date(
                                                post.createdAt
                                            ).toLocaleString()}
                                            {user.role === "ADMIN" &&
                                                post.user && (
                                                    <span>
                                                        {" "}
                                                        | By: {post.user.email}
                                                    </span>
                                                )}
                                        </p>
                                        {(post.user?.id === user.id ||
                                            user.role === "ADMIN") && (
                                            <div className="mt-2 flex gap-2">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setEditPostId(post.id);
                                                        setEditContent(
                                                            post.content
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        handleDeletePost(
                                                            post.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
