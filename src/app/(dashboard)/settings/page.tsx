"use client";

import { useState, useEffect } from "react";
import {
    User,
    Key,
    Shield,
    Zap,
    Bell,
    Database,
    Save,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>({
        full_name: "",
        username: "",
        avatar_url: ""
    });
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) setProfile(data);
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', user.id);

        if (!error) {
            alert("Settings saved successfully!");
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Settings</h1>
                <p className="text-neutral-500 font-medium">Manage your profile, API keys, and workspace preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Section */}
                <section className="bg-[#151515] border border-white/5 rounded-[40px] p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 text-blue-400 rounded-2xl">
                            <User className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black">Profile Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Full Name</label>
                            <input
                                type="text"
                                value={profile.full_name || ""}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-sm focus:border-blue-500/30 outline-none transition-all"
                                placeholder="Demi Developer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Username</label>
                            <input
                                type="text"
                                value={profile.username || ""}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-sm focus:border-blue-500/30 outline-none transition-all"
                                placeholder="demidev"
                            />
                        </div>
                    </div>
                </section>

                {/* API Keys Section */}
                <section className="bg-[#151515] border border-white/5 rounded-[40px] p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600/10 text-purple-400 rounded-2xl">
                            <Key className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black">AI Intelligence</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 bg-blue-600/5 border border-blue-600/10 rounded-3xl flex items-start gap-4">
                            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                            <p className="text-sm text-blue-300/80 leading-relaxed">
                                By default, Demi IO uses our internal credit system. You can bring your own keys to increase rate limits or use custom models.
                            </p>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Anthropic / OpenAI API Key</label>
                            <div className="relative">
                                <input
                                    type={showKey ? "text" : "password"}
                                    readOnly
                                    value="sk-proj-•••••••••••••••••••••••••••••"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all opacity-50 cursor-not-allowed"
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                >
                                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-black text-lg transition-all shadow-xl hover:bg-neutral-200 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
