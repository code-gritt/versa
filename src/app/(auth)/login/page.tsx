"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import Tag from "@/components/Tag";
import { login } from "@/lib/mutation";
import Loader from "@/components/Loader";

export default function Login() {
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
            const { user, token } = await login(email, password);
            setAuth(user, token);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to Google OAuth URL with frontend callback
        const redirectUri = encodeURIComponent(
            "https://versa-api-f9sl.onrender.com/auth/complete/google-oauth2/"
        );
        const clientId = encodeURIComponent(
            "1077311579805-n1fonddbo5e2jnbhae0j6fesps5d6nv1.apps.googleusercontent.com"
        );
        const scope = encodeURIComponent("email profile openid");
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
        window.location.href = googleAuthUrl;
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
                        <Tag>Login</Tag>
                    </div>
                    <h1 className="text-6xl font-medium text-center mt-6 text-white">
                        Sign in to <span className="text-lime-400">Versa</span>
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
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full mt-4 flex items-center justify-center gap-2"
                                onClick={handleGoogleLogin}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>
                        </form>
                        <p className="text-center text-white/50 mt-4">
                            Don’t have an account?{" "}
                            <a
                                href="/register"
                                className="text-lime-400 hover:underline"
                            >
                                Sign up
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
