"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { createPost } from "@/lib/mutation";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import Tag from "@/components/Tag";
import Loader from "@/components/Loader";

export default function Dashboard() {
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, setAuth } = useAuthStore();
    const router = useRouter();

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { post, user: updatedUser } = await createPost(content);
            setAuth(updatedUser, useAuthStore.getState().token!);
            setContent("");
            alert(`Post created! Credits used: ${post.credits_used}`);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Failed to create post");
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Post Content
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
                                    rows={5}
                                    required
                                    placeholder="Enter your post content..."
                                />
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={loading || user.credits < 10}
                            >
                                {loading
                                    ? "Creating Post..."
                                    : "Create Post (10 Credits)"}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
