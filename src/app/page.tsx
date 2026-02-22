"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Target, Chrome, Loader2, Play, Shield, Cpu, Globe, MessageSquare, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Dashboard } from "@/components/Dashboard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [view, setView] = useState<"landing" | "loading" | "dashboard">("landing");
  const [prompt, setPrompt] = useState("");
  const [extensionData, setExtensionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const examples = [
    {
      title: "Amazon Price Tracker",
      description: "Highlight all prices on Amazon and show a total.",
      icon: <Chrome className="w-5 h-5 text-blue-400" />,
      color: "from-blue-500/20 to-transparent"
    },
    {
      title: "AI Ad Blocker",
      description: "Intelligently hide all elements with class 'ad-sidebar' or 'sponsored'.",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      color: "from-yellow-500/20 to-transparent"
    },
    {
      title: "Smart Data Scraper",
      description: "Extract list of links and copy to clipboard as JSON.",
      icon: <Target className="w-5 h-5 text-purple-400" />,
      color: "from-purple-500/20 to-transparent"
    },
  ];

  const features = [
    {
      title: "Natural Language to Code",
      description: "Our engine translates your plain English into optimized JavaScript and Manifest v3 logic.",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      title: "Instant Verification",
      description: "Auto-validation of permissions and API calls to ensure your extension works out of the box.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Share with the World",
      description: "Deploy to your team or the Chrome Web Store with one click using our simplified delivery system.",
      icon: <Globe className="w-6 h-6" />,
    }
  ];

  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setView("loading");
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // User is logged in -> Create Project directly
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

        // Redirect to Editor
        router.push(`/project/${project.id}?prompt=${encodeURIComponent(prompt)}`);
      } else {
        // User is not logged in -> Redirect to Login with Prompt
        router.push(`/login?prompt=${encodeURIComponent(prompt)}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setView("landing"); // Go back to landing on error
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
          className="relative min-h-screen flex flex-col bg-background text-foreground"
        >
          {/* Lovable Background Vibe */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-bg-lovable-gradient opacity-[0.15] dark:opacity-[0.1] blur-[160px] rounded-full" />

            {/* Floating Orbs */}
            <motion.div
              animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
            />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
          </div>

          {/* Nav */}
          <nav className="fixed top-0 w-full flex justify-between items-center p-6 lg:px-12 z-50 backdrop-blur-sm bg-background/50 border-b border-border">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-primary/25">
                <span className="font-bold">D</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Demi IO</span>
            </Link>
            <div className="flex gap-4">
              {/* Nav Links could go here */}
            </div>
          </nav>

          {/* Hero Section */}
          <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto text-center space-y-8 z-10 relative">

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground mb-4 hover:bg-secondary/80 transition-colors cursor-default"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>v1.0 is now live</span>
              </motion.div>

              <motion.h1
                style={{ opacity, scale }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground mix-blend-screen"
              >
                Build browser extensions <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">in plain English.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                Demi converts your natural language descriptions into fully functional, deployed Chrome Extensions in seconds. No coding required.
              </motion.p>


              {/* Premium Prompt Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group max-w-2xl mx-auto w-full"
              >
                {/* Glowing Backlight */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-30 group-focus-within:opacity-70 blur-xl transition-opacity duration-500 rounded-3xl" />

                <div className="relative glass-card bg-black/40 backdrop-blur-3xl rounded-[28px] p-2 flex flex-col gap-2 border border-white/10 shadow-2xl group-focus-within:border-white/20 transition-all">
                  <textarea
                    placeholder="Describe a browser extension you want to build..."
                    className="w-full bg-transparent text-lg md:text-xl p-4 resize-none min-h-[60px] max-h-[200px] outline-none placeholder:text-neutral-600 text-white leading-relaxed"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                  />
                  <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex gap-2">
                      {/* Tags or options could go here */}
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="group/btn relative inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Generate
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Examples Sub-text */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-medium text-neutral-500 pt-6">
                <span className="opacity-50">Try these:</span>
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex.description)}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/5"
                  >
                    {ex.icon}
                    {ex.title}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How it works</h2>
                <p className="text-neutral-400 text-lg">From thought to deployment in seconds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Describe", text: "Explain the behavior you want in plain text.", icon: <MessageSquare className="w-6 h-6 text-blue-400" /> },
                  { step: "02", title: "Refine", text: "Use the smart editor to chat and iterate on the code.", icon: <Cpu className="w-6 h-6 text-purple-400" /> },
                  { step: "03", title: "Deploy", text: "Download your ZIP and load it instantly.", icon: <Zap className="w-6 h-6 text-yellow-400" /> }
                ].map((s, i) => (
                  <div key={i} className="relative p-8 rounded-3xl bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="absolute top-8 right-8 text-6xl font-black text-white/5">{s.step}</div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                      {s.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Performance Status Section */}
          <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto rounded-[40px] p-12 md:p-20 flex flex-col md:flex-row items-center gap-20 bg-gradient-to-b from-[#0f0f0f] to-black border border-white/5">
              <div className="flex-1 space-y-8">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">Built for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">speed & precision.</span></h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg text-white">Instant Generation</h4>
                      <p className="text-sm text-neutral-400">Complex logic compiled in sub-3 seconds.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg text-white">Model Selection</h4>
                      <p className="text-sm text-neutral-400">Choose between Claude 3.5 Sonnet, GPT-4o, and more.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
                <div className="relative text-8xl font-black text-white/5 tracking-tighter">DEMI</div>
              </div>
            </div>
          </section>

          {/* Minimal Footer */}
          <footer className="py-12 text-center text-neutral-600 text-xs font-medium uppercase tracking-widest border-t border-white/5">
            <div className="flex justify-center gap-8 mb-4">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
            <p>© 2026 DEMI IO.</p>
          </footer>

        </motion.div>
      )
      }

      {
        view === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full flex flex-col items-center justify-center bg-black"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Setting up your project...</h2>
            <p className="text-neutral-500">Initializing workspace and selecting AI model</p>
          </motion.div>
        )
      }

      {
        view === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-full"
          >
            <Dashboard
              prompt={prompt}
              extensionData={extensionData}
              onBack={() => setView("landing")}
            />
          </motion.div>
        )
      }
    </AnimatePresence >
  );
}
