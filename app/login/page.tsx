"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                setError("Fjalëkalim i pasaktë. Provojeni përsëri.");
            }
        } catch (err) {
            setError("Diçka shkoi keq. Ju lutem provojeni përsëri.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A14] p-4 font-sans selection:bg-red-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/20 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mb-6 h-20 w-20 overflow-hidden rounded-2xl border border-white/20 shadow-lg"
                        >
                            <Image
                                src="/icon.png"
                                alt="EdBot Logo"
                                width={80}
                                height={80}
                                className="object-cover"
                            />
                        </motion.div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                            EdBot
                        </h1>
                        <p className="text-sm text-white/50">
                            Ky aplikacion është privat. Shkruani fjalëkalimin për të hyrë.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-white/30 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Fjalëkalimi"
                                className="w-full rounded-2xl border border-white/20 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-white/30 outline-none transition-all focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-red-500/10"
                                required
                                autoFocus
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-center text-sm font-medium text-red-500"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Hyr tani</span>
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-white/30 uppercase tracking-widest font-semibold">
                    &copy; 2026 EdBot Security
                </p>
            </motion.div>
        </div>
    );
}