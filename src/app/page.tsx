"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sparkles, Zap, Target, Chrome, Loader2, Shield, Cpu } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Carousel } from "@/components/Carousel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [view, setView] = useState<"landing" | "loading">("landing");
  const [prompt, setPrompt] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const carouselItems = [
    {
      title: "Amazon Intelligence",
      description: "Automatically tracks historical prices and suggests the best time to buy using localized data.",
      icon: <Chrome />,
      color: "from-blue-600 to-blue-400"
    },
    {
      title: "Ad-Blocker Pro Max",
      description: "Our AI engine identifies and removes sophisticated tracking scripts that traditional blockers miss.",
      icon: <Zap />,
      color: "from-yellow-600 to-orange-400"
    },
    {
      title: "Data Extraction Suite",
      description: "Turn any webpage into a structured JSON dataset with one click. Perfect for market researchers.",
      icon: <Target />,
      color: "from-purple-600 to-pink-400"
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setView("loading");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: project, error: projError } = await supabase
          .from('projects')
          .insert({
            user_id: session.user.id,
            name: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
            description: prompt,
          })
          .select()
          .single();

        if (projError) throw projError;
        router.push(`/project/${project.id}?prompt=${encodeURIComponent(prompt)}`);
      } else {
        router.push(`/login?prompt=${encodeURIComponent(prompt)}`);
      }
    } catch (err: any) {
      console.error(err);
      setView("landing");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {view === "landing" && (
        <motion.div
          key="landing"
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative min-h-screen flex flex-col bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans"
        >
          {/* Immersive Background */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[70%] bg-purple-600/10 blur-[160px] rounded-full" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          {/* Dynamic Nav */}
          <nav className="fixed top-0 w-full flex justify-between items-center py-6 px-8 md:px-16 z-50 backdrop-blur-xl border-b border-white/5 bg-black/20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-blue-500/40 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  D
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tighter">DEMI <span className="text-blue-500">IO</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">Showcase</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <Link href="/login" className="px-6 py-2.5 bg-white text-black rounded-xl hover:bg-neutral-200 transition-all font-black">
                Sign In
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="relative pt-48 pb-32 px-6 z-10">
            <div className="max-w-6xl mx-auto text-center space-y-12">

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black text-blue-400 tracking-widest uppercase mb-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Extension Factory</span>
              </motion.div>

              <motion.h1
                style={{ opacity, scale }}
                className="text-6xl md:text-7xl font-black tracking-tighter leading-tight text-white"
              >
                Idea to extension <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 animate-gradient-x">in plain English.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Demi converts your natural language descriptions into fully functional, production-ready browser extensions. No code. No complexity.
              </motion.p>

              {/* Ultra-Premium Prompt Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group max-w-3xl mx-auto w-full mt-12"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 opacity-20 group-focus-within:opacity-50 blur-2xl transition-opacity duration-700 rounded-[32px]" />

                <div className="relative bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[32px] p-2 flex flex-col gap-2 border border-white/10 shadow-3xl group-focus-within:border-blue-500/50 transition-all">
                  <textarea
                    placeholder="Describe your extension (e.g., 'A tool that sums up all prices on a page and saves to CSV')"
                    className="w-full bg-transparent text-xl md:text-2xl p-6 resize-none min-h-[100px] outline-none placeholder:text-neutral-700 text-white leading-relaxed font-medium"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                  />
                  <div className="flex items-center justify-between px-4 pb-4">
                    <div className="flex gap-3">
                      <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2 text-xs font-bold text-neutral-500">
                        <Cpu className="w-3.5 h-3.5" />
                        GPT-4o / Gemini
                      </div>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="group/btn relative inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-30"
                    >
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      Build Extension
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Interactive Showcase (Carousel) */}
          <section className="py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tight">Built with Demi.</h2>
                <p className="text-neutral-400 text-xl font-medium">See what others are launching in seconds.</p>
              </div>

              <Carousel items={carouselItems} />
            </div>
          </section>

          {/* Feature Grid */}
          <section className="py-32 px-6 relative z-10 border-t border-white/5 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Manifest v3 Native", description: "Fully compliant with latest security standards. Ready for the Web Store.", icon: <Shield className="text-green-400" /> },
                { title: "Smart Logic Engine", description: "Complex context-aware generation for DOM manipulation and background tasks.", icon: <Cpu className="text-purple-400" /> },
                { title: "One-Click Deploy", description: "Get your ZIP bundle instantly. Load it, test it, launch it.", icon: <Zap className="text-yellow-400" /> }
              ].map((f, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-black/40 border border-white/5 hover:border-white/20 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <div className="scale-150">{f.icon}</div>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4">{f.title}</h3>
                  <p className="text-neutral-500 leading-relaxed text-lg font-medium">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-40 px-6 relative z-10 overflow-hidden">
            <div className="max-w-5xl mx-auto text-center space-y-12">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">Ready to launch?</h1>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-12 py-6 bg-white text-black rounded-3xl font-black text-2xl hover:bg-neutral-200 transition-all shadow-2xl shadow-white/10 active:scale-95"
              >
                Start Building Now
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-24 border-t border-white/5 bg-black relative z-20">
            <div className="max-w-7xl mx-auto px-8 md:px-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                <div className="col-span-1 md:col-span-1 space-y-6 text-center md:text-left">
                  <Link href="/" className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">D</div>
                    <span className="font-extrabold text-xl tracking-tighter uppercase">DEMI IO.</span>
                  </Link>
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-[240px] mx-auto md:mx-0">
                    The world's first AI-native browser extension factory. Turn intent into production-ready tools instantly.
                  </p>
                </div>

                <div className="space-y-6 text-center md:text-left">
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Platform</h4>
                  <ul className="space-y-4 text-sm font-bold text-neutral-500">
                    <li><a href="#" className="hover:text-white transition-colors">Showcase</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Components</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  </ul>
                </div>

                <div className="space-y-6 text-center md:text-left">
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Resources</h4>
                  <ul className="space-y-4 text-sm font-bold text-neutral-500">
                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  </ul>
                </div>

                <div className="space-y-6 text-center md:text-left">
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Company</h4>
                  <ul className="space-y-4 text-sm font-bold text-neutral-500">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-neutral-700 text-xs font-bold uppercase tracking-widest">© 2026 METAVERSE GLOBAL</p>
                <div className="flex gap-8">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">All systems operational</span>
                   </div>
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      )}

      {view === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen w-full flex flex-col items-center justify-center bg-[#050505]"
        >
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-blue-600/30 blur-[100px] rounded-full animate-pulse" />
            <Loader2 className="relative z-10 w-20 h-20 text-blue-500 animate-spin" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-4 text-white uppercase italic">Initializing Engine...</h2>
          <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Selecting best AI model for task</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
