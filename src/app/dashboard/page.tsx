"use client";

import { useEffect, useState } from "react";
import { me } from "@/lib/mutation";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Tag from "@/components/Tag";

export default function Dashboard() {
    const { user, token, setAuth, clearAuth } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                router.push("/login");
                return;
            }
            try {
                const userData = await me();
                setAuth(userData, token);
            } catch (err: any) {
                setError(err.message || "Failed to fetch user data");
                clearAuth();
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token, setAuth, clearAuth, router]);

    if (!token) {
        router.push("/login");
        return null;
    }

    if (loading)
        return <div className="text-white text-center py-24">Loading...</div>;
    if (error)
        return (
            <div className="text-red-400 text-center py-24">Error: {error}</div>
        );

    return (
        <section className="py-24 bg-neutral-950 min-h-screen">
            <div className="container max-w-5xl">
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
                        <span className="text-lime-400">{user?.email}</span>
                    </h1>
                    <div className="max-w-md mx-auto mt-8 p-6 border border-white/15 rounded-[27px] bg-neutral-900/70 backdrop-blur">
                        <div className="space-y-4">
                            <p className="text-white/80">
                                <span className="font-semibold">Credits:</span>{" "}
                                {user?.credits}
                            </p>
                            <p className="text-white/80">
                                <span className="font-semibold">Role:</span>{" "}
                                {user?.role}
                            </p>
                            <p className="text-white/80">
                                <span className="font-semibold">ID:</span>{" "}
                                {user?.id}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
