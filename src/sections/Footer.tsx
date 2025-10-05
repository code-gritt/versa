import Image from "next/image";
import siteLogo from "@/assets/images/logo.svg";

const footerLinks = [
    { href: "#", label: "Contact" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms & Conditions" },
];

export default function Footer() {
    return (
        <section className="py-16">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
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
                            <circle cx="18" cy="18" r="18" fill="#A1E233" />
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
                    <div>
                        <nav className="flex gap-6">
                            {footerLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-white/50 text-sm "
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
}
