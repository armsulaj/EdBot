"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        try {
            setLoading(true);

            const provider = new GoogleAuthProvider();

            await signInWithPopup(auth, provider);

            router.push("/");
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 font-sans selection:bg-red-500/30">
            {/* Background blur */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/10 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                    
                    {/* Logo */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-6 h-20 w-20 overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                            <Image
                                src="/icon.png"
                                alt="EdBot Logo"
                                width={80}
                                height={80}
                                className="object-cover"
                            />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                            EdBot
                        </h1>

                        <p className="text-sm text-white/50">
                            Hyni me Google për të ruajtur historinë dhe progresin tuaj.
                        </p>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={signIn}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Image
                                    src="/google.svg"
                                    alt="Google"
                                    width={20}
                                    height={20}
                                />
                                Sign in with Google
                            </>
                        )}
                    </button>
                </div>

                <p className="mt-8 text-center text-xs text-white/20 uppercase tracking-widest font-semibold">
                    &copy; 2026 EdBot
                </p>
            </motion.div>
        </div>
    );
}