"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Suspense } from "react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prompt = searchParams.get('prompt');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                if (prompt) {
                    router.push('/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        });
    }, [router, prompt]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (isSignUp) {
                result = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    }
                });
            } else {
                result = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
            }

            if (result.error) throw result.error;

            if (prompt) {
                const user = result.data.user;
                const session = result.data.session;

                if (user && session) {
                    const { data: project, error: projError } = await supabase
                        .from('projects')
                        .insert({
                            user_id: user.id,
                            name: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
                            description: prompt,
                        })
                        .select()
                        .single();

                    if (projError) throw projError;
                    router.push(`/project/${project.id}?prompt=${encodeURIComponent(prompt)}`);
                } else if (isSignUp && !session) {
                    alert("Check your email for the confirmation link!");
                }
            } else {
                router.push('/dashboard');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-bg-lovable-gradient opacity-[0.1] blur-[140px] rounded-full" />

                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 1 }}
                    className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"
                />

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-black mb-6 shadow-xl shadow-white/10"
                    >
                        <Zap className="w-7 h-7 fill-current" />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight brand-font mb-2">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
                    <p className="text-neutral-400 font-medium">
                        {prompt ? "Sign in to start building your extension." : "Sign in to manage your extensions."}
                    </p>

                    {prompt && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 backdrop-blur-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Building: <span className="text-white italic">"{prompt.slice(0, 40)}{prompt.length > 40 ? '...' : ''}"</span>
                        </motion.div>
                    )}
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    <div className="relative glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-3xl">
                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAuth(e))}
                                        className="w-full bg-white/5 border border-white/5 focus:border-white/20 focus:bg-white/10 rounded-xl py-4 pl-10 pr-4 outline-none transition-all placeholder:text-neutral-600 text-white"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAuth(e))}
                                        className="w-full bg-white/5 border border-white/5 focus:border-white/20 focus:bg-white/10 rounded-xl py-4 pl-10 pr-4 outline-none transition-all placeholder:text-neutral-600 text-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </motion.div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-white/5"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                                        <motion.div animate={{ x: isHovering ? 5 : 0 }}>
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </>
                                )}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-neutral-400">{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 font-bold text-white hover:underline"
                            >
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
