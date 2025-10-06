"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import Tag from "@/components/Tag";
import { register } from "@/lib/mutation";
import Loader from "@/components/Loader";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { user, token } = await register(email, password);
            setAuth(user, token);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Registration failed");
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
                        <Tag>Register</Tag>
                    </div>
                    <h1 className="text-6xl font-medium text-center mt-6 text-white">
                        Join <span className="text-lime-400">Versa</span>
                    </h1>
                    <div className="max-w-md mx-auto mt-8 p-6 border border-white/15 rounded-[27px] bg-neutral-900/70 backdrop-blur">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Registering..." : "Sign Up"}
                            </Button>
                            {/* Google login button */}
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full mt-4"
                                onClick={() => {
                                    // Redirect to the start of the OAuth2 flow
                                    window.location.href =
                                        "https://versa-api-f9sl.onrender.com/auth/login/google-oauth2/?next=/dashboard";
                                }}
                            >
                                Continue with Google
                            </Button>
                        </form>
                        <p className="text-center text-white/50 mt-4">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-lime-400 hover:underline"
                            >
                                Log in
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
