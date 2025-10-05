"use client";

import logoImage from "@/assets/images/logo.svg";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Button from "@/components/Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#integrations" },
    { label: "FAQs", href: "#faqs" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <section className="py-4 lg:py-8 fixed w-full top-0 z-50 ">
                <div className="container max-w-5xl">
                    <div className="border border-white/15 rounded-[27px] lg:rounded-full bg-neutral-950/70 backdrop-blur">
                        <figure className="grid grid-cols-2 lg:grid-cols-3  py-2 lg:px-2 px-4  items-center ">
                            <Link href="/">
                                <div className="flex items-center gap-3">
                                    {/* Custom Versa Logo */}
                                    <svg
                                        width="36"
                                        height="36"
                                        viewBox="0 0 36 36"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-9 w-9"
                                    >
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="18"
                                            fill="#A1E233"
                                        />
                                        <path
                                            d="M10 20 L16 26 L26 10"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    {/* Stylish Versa Text */}
                                    <span
                                        className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent 
               bg-gradient-to-r from-purple-400 via-pink-400 to-lime-400"
                                    >
                                        Versa
                                    </span>
                                </div>
                            </Link>

                            <div className="hidden lg:flex justify-center items-center ">
                                <nav className="flex gap-6 font-medium ">
                                    {navLinks.map((each) => (
                                        <a href={each.href} key={each.href}>
                                            {each.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="lg:hidden"
                                >
                                    {!isOpen ? (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{
                                                opacity: isOpen ? 0 : 1,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Menu
                                                className="text-white"
                                                size={30}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: isOpen ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <X
                                                className="text-white"
                                                size={30}
                                            />
                                        </motion.div>
                                    )}
                                </button>
                                <Button
                                    variant="secondary"
                                    className="hidden lg:inline-flex items-center"
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    className="hidden lg:inline-flex items-center"
                                >
                                    Signup
                                </Button>
                            </div>
                        </figure>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.figure
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden lg:hidden"
                                >
                                    <div className="flex flex-col items-center gap-4 py-4">
                                        {navLinks.map((link) => (
                                            <a key={link.href} href={link.href}>
                                                {link.label}
                                            </a>
                                        ))}
                                        <Button
                                            className="w-3/4"
                                            variant="secondary"
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            className="w-3/4"
                                            variant="primary"
                                        >
                                            Sign Up
                                        </Button>
                                    </div>
                                </motion.figure>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
            <div className="pb-[86px] md:pb-[98px]"></div>
        </>
    );
}
