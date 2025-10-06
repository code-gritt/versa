"use client";

import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-md z-50">
            <div className="relative w-32 h-32">
                {/* Square 1 */}
                <motion.div
                    className="absolute w-24 h-24 rounded-md"
                    style={{
                        backgroundColor: "#ffffff",
                        opacity: 10, // softer, semi-transparent
                        filter: "blur(2px)", // blur effect
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                    }}
                />

                {/* Square 2 */}
                <motion.div
                    className="absolute w-24 h-24 rounded-md"
                    style={{
                        backgroundColor: "#A3E635",
                        opacity: 10, // softer, semi-transparent
                        filter: "blur(2px)", // blur effect
                    }}
                    animate={{ rotate: -360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                    }}
                />
            </div>
        </div>
    );
};

export default Loader;
