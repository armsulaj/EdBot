"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyBZa5bID9BVGCHKprx7amBNt4yTeCqK_k0",
  authDomain: "edbot-6024c.firebaseapp.com",
  projectId: "edbot-6024c",
  storageBucket: "edbot-6024c.firebasestorage.app",
  messagingSenderId: "323122555465",
  appId: "1:323122555465:web:fdbeed48d1b2ee988bad98",
  measurementId: "G-H0VJLNG0ZE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// --- Login Component ---
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      // const user = result.user;

      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError("Diçka shkoi keq gjatë hyrjes me Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A14] p-4 font-sans selection:bg-red-500/30">
      {/* Background glows */}
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
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="absolute left-4 flex items-center">
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <span>Hyr me Google</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center text-sm font-medium text-red-500 mt-3"
            >
              {error}
            </motion.p>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-white/30 uppercase tracking-widest font-semibold">
          &copy; 2026 EdBot. Të gjitha të drejtat e rezervuara.
        </p>
      </motion.div>
    </div>
  );
}