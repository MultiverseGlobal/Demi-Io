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
        <div className="min-h-screen bg-[#050505] text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ultra-Premium Background Intelligence */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Primary Mesh Gradients */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0],
                        x: ['-10%', '10%', '-10%'],
                        y: ['-10%', '5%', '-10%']
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full blur-[160px] opacity-40"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -45, 0],
                        x: ['10%', '-10%', '10%'],
                        y: ['10%', '-5%', '10%']
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[160px] opacity-40 transition-colors"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />

                {/* Noise & Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 contrast-150 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative inline-block mb-8"
                    >
                        <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 animate-pulse-slow" />
                        <div className="relative w-16 h-16 bg-white rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-500/20 group cursor-default">
                            <Zap className="w-8 h-8 text-black fill-current group-hover:scale-110 transition-transform duration-300" />
                        </div>
                    </motion.div>

                    <h1 className="text-5xl font-black tracking-tighter text-white mb-3">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-neutral-500 font-medium text-lg px-8">
                        {prompt ? "Sign in to start building your extension idea." : "The AI-native dashboard for next-gen extensions."}
                    </p>

                    {prompt && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 mx-auto inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 backdrop-blur-md shadow-xl"
                        >
                            <div className="relative">
                                <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                                <span className="relative block w-2 h-2 rounded-full bg-blue-500" />
                            </div>
                            Building: <span className="text-white italic font-medium">"{prompt.slice(0, 32)}{prompt.length > 32 ? '...' : ''}"</span>
                        </motion.div>
                    )}
                </div>

                <div className="relative">
                    {/* Border Glow Effect */}
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/20 rounded-[32px] blur-sm opacity-50" />

                    <div className="relative bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[32px] shadow-3xl overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />

                        <form onSubmit={handleAuth} className="space-y-6 relative">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 block px-1">Email Address</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-x-0 bottom-0 h-[100%] bg-white/[0.02] rounded-2xl transition-all group-focus-within/input:bg-white/[0.05]" />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-600 transition-colors group-focus-within/input:text-white" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent border border-white/5 focus:border-white/20 rounded-2xl py-4.5 pl-12 pr-4 outline-none transition-all placeholder:text-neutral-700 text-white font-medium relative z-10"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 block px-1">Secret Key</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-x-0 bottom-0 h-[100%] bg-white/[0.02] rounded-2xl transition-all group-focus-within/input:bg-white/[0.05]" />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-600 transition-colors group-focus-within/input:text-white" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent border border-white/5 focus:border-white/20 rounded-2xl py-4.5 pl-12 pr-4 outline-none transition-all placeholder:text-neutral-700 text-white font-medium relative z-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold leading-relaxed flex items-start gap-3"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className="group/btn relative w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden active:scale-[0.98] disabled:opacity-50 mt-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                                <div className="relative flex items-center justify-center gap-2.5">
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>{isSignUp ? "Create My Workspace" : "Access Workspace"}</span>
                                            <motion.div animate={{ x: isHovering ? 5 : 0 }}>
                                                <ArrowRight className="w-4.5 h-4.5" />
                                            </motion.div>
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                {isSignUp ? (
                                    <>Already Registered? <span className="text-blue-500">Sign In</span></>
                                ) : (
                                    <>No account yet? <span className="text-blue-500">Initialize One</span></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer Subtle Stats or Branding */}
            <div className="absolute bottom-8 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-800">
                AI Extension Factory — Ver 2.0.4 — SECURED BY SUPABASE
            </div>
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
