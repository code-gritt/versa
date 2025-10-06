"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleOAuth } from "@/lib/mutation";
import { useAuthStore } from "@/lib/store";
import Loader from "@/components/Loader";

export default function CallbackPageWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <CallbackPage />
        </Suspense>
    );
}

function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth } = useAuthStore();

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            router.replace("/login?error=No+code+provided");
            return;
        }

        googleOAuth(code)
            .then(({ user, token }) => {
                setAuth(user, token);
                router.replace("/dashboard");
            })
            .catch((err) => {
                const errorMsg =
                    err instanceof Error ? err.message : "OAuth failed";
                router.replace(`/login?error=${encodeURIComponent(errorMsg)}`);
            });
    }, [searchParams, router, setAuth]);

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
