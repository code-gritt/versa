"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleOAuth } from "@/lib/mutation";
import { useAuthStore } from "@/lib/store";
import Loader from "@/components/Loader";

export default function Callback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth } = useAuthStore();

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code");
            if (!code) {
                router.push("/login?error=No+code+provided");
                return;
            }

            try {
                const { user, token } = await googleOAuth(code);
                setAuth(user, token);
                router.push("/dashboard");
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : "Google OAuth failed";
                router.push(`/login?error=${encodeURIComponent(errorMessage)}`);
            }
        };

        handleCallback();
    }, [searchParams, setAuth, router]);

    return (
        <section className="py-24 bg-neutral-950 min-h-screen relative">
            <Loader />
            <div className="container max-w-5xl relative z-10">
                <div className="text-white text-center">
                    Processing Google OAuth...
                </div>
            </div>
        </section>
    );
}
