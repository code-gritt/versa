"use client";

import Tag from "@/components/Tag";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const faqs = [
    {
        question: "How is Versa different from other monitoring tools?",
        answer: "Versa prioritizes simplicity, speed, and predictability. Unlike complex platforms, it lets you track performance, uptime, and SEO metrics in real-time with a credit-based system that scales with your needs.",
    },
    {
        question: "Is there a learning curve?",
        answer: "Versa is intuitive from day one. Setting up monitors, managing credits, and viewing dashboards takes minutes. Our documentation and in-app guidance help you get started quickly.",
    },
    {
        question: "Can I monitor multiple sites?",
        answer: "Yes! Versa supports multi-site monitoring. You can configure each site’s scan frequency, mode (standard or intensive), and view combined historical trends in the dashboard.",
    },
    {
        question: "How do alerts work?",
        answer: "Versa sends real-time notifications via WebSockets for downtime, load spikes, or broken links. You can also integrate alerts with Slack, email, or third-party platforms.",
    },
    {
        question: "Does Versa integrate with other tools?",
        answer: "Absolutely. Versa connects with popular platforms like Slack, Notion, GitHub, and Zapier, allowing you to automate workflows and centralize your monitoring data.",
    },
];

export default function Faqs() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <section className="py-24">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>FAQs</Tag>
                </div>
                <h2 className="text-6xl font-medium mt-6 text-center max-w-xl mx-auto">
                    Questions? We&apos;ve got{" "}
                    <span className="text-lime-400">answers</span>
                </h2>

                <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
                    {faqs.map((faq, faqIndex) => (
                        <div
                            key={faq.question}
                            onClick={() => setSelectedIndex(faqIndex)}
                            className="bg-neutral-900 rounded-2xl border border-white/10 p-6 cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium m-0">
                                    {faq.question}
                                </h3>
                                <Plus
                                    size={30}
                                    className={twMerge(
                                        "text-lime-400 flex-shrink-0 transition duration-300",
                                        selectedIndex === faqIndex &&
                                            "rotate-45"
                                    )}
                                />
                            </div>

                            <AnimatePresence>
                                {selectedIndex === faqIndex && (
                                    <motion.div
                                        initial={{
                                            height: 0,
                                            marginTop: 0,
                                        }}
                                        animate={{
                                            height: "auto",
                                            marginTop: 24,
                                        }}
                                        exit={{
                                            height: 0,
                                            marginTop: 0,
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-white/50">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
