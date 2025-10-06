"use client";

import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, token, clearAuth } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        clearAuth();
        router.push("/login");
    };

    const getAvatarInitials = (email: string) => email.charAt(0).toUpperCase();

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-neutral-950/90 backdrop-blur-lg shadow-md">
                <div className="container mx-auto max-w-5xl px-4 lg:px-0 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-9 h-9">
                            <svg
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                            >
                                <circle cx="18" cy="18" r="18" fill="#A1E233" />
                                <path
                                    d="M10 20 L16 26 L26 10"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-lime-400">
                            Versa
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user && token ? (
                            <>
                                <span className="text-white/80 font-medium">
                                    Credits: {user.credits}
                                </span>
                                <div className="bg-lime-400 text-neutral-950 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                    {getAvatarInitials(user.email)}
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push("/login")}
                                >
                                    Log In
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => router.push("/register")}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden overflow-hidden bg-neutral-950/95 backdrop-blur-lg"
                        >
                            <div className="flex flex-col items-center gap-4 py-4">
                                {user && token ? (
                                    <>
                                        <span className="text-white/80 font-medium">
                                            Credits: {user.credits}
                                        </span>
                                        <div className="bg-lime-400 text-neutral-950 rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                            {getAvatarInitials(user.email)}
                                        </div>
                                        <Button
                                            variant="secondary"
                                            className="w-3/4"
                                            onClick={() =>
                                                router.push("/dashboard")
                                            }
                                        >
                                            Dashboard
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="w-3/4"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="secondary"
                                            className="w-3/4"
                                            onClick={() =>
                                                router.push("/login")
                                            }
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="w-3/4"
                                            onClick={() =>
                                                router.push("/register")
                                            }
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="pt-20"></div>
        </>
    );
}
