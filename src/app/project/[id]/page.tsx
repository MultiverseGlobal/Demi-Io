"use client";

import { useState, Suspense, useEffect, useCallback } from "react";
import {
    Send,
    Bot,
    User,
    Sparkles,
    ChevronDown,
    Code2,
    Play,
    Share2,
    Settings,
    Loader2,
    Zap,
    Shield,
    Info,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    GitFork,
    Save,
    History,
    RotateCcw,
    Link,
    Copy,
    Globe,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import JSZip from "jszip";
import { validateIntent, sanitizeManifest, validateGuardrails, TrustReport } from "@/lib/intelligence";

function ProjectEditorContent({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get('prompt');

    const [project, setProject] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");
    const [files, setFiles] = useState<Record<string, string>>({});
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [intent, setIntent] = useState<any>(null);
    const [trustReport, setTrustReport] = useState<TrustReport | null>(null);
    const [guardrailIssues, setGuardrailIssues] = useState<string[]>([]);
    const [intelligenceStatus, setIntelligenceStatus] = useState<{
        intentLocked: boolean;
        permissionsPruned: boolean;
        guardrailsPassed: boolean;
    }>({ intentLocked: false, permissionsPruned: false, guardrailsPassed: true });
    const [showTrustReport, setShowTrustReport] = useState(false);
    const [versions, setVersions] = useState<any[]>([]);
    const [showVersionBrowser, setShowVersionBrowser] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareSlug, setShareSlug] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);

    const handleDownloadZip = async () => {
        const zip = new JSZip();

        // Add all files to the ZIP
        Object.entries(files).forEach(([filename, content]) => {
            zip.file(filename, content);
        });

        const blob = await zip.generateAsync({ type: "blob" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project?.name || 'demi-extension'}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
        setShowInstallModal(true);
    };

    const handleFork = async () => {
        setIsGenerating(true);
        const { data, error } = await supabase.functions.invoke('project-service', {
            body: { action: 'fork', projectId: params.id, name: `${project?.name} (Forked)` }
        });
        setIsGenerating(false);
        if (data && !error) {
            window.location.href = `/project/${data.id}`;
        }
    };

    const handleShare = async () => {
        setIsSharing(true);
        const { data, error } = await supabase
            .from('project_shares')
            .select('share_slug')
            .eq('project_id', params.id)
            .single();

        if (data) {
            setShareSlug(data.share_slug);
            setIsSharing(false);
            setShowShareModal(true);
        } else {
            const slug = Math.random().toString(36).substring(2, 10);
            const { error: insertErr } = await supabase
                .from('project_shares')
                .insert({
                    project_id: params.id,
                    user_id: project.user_id,
                    share_slug: slug,
                    is_public: true
                });

            if (!insertErr) {
                setShareSlug(slug);
            }
            setIsSharing(false);
            setShowShareModal(true);
        }
    };

    const handleSaveCheckpoint = async () => {
        const { data, error } = await supabase.functions.invoke('project-service', {
            body: { action: 'save-version', projectId: params.id, code: files }
        });
        if (data && !error) {
            setVersions(prev => [data, ...prev]);
            alert("Checkpoint saved!");
        }
    };

    const handleRestoreVersion = (version: any) => {
        if (confirm("Are you sure you want to restore this version? Your current unsaved changes will be lost.")) {
            setFiles(version.code);
            const fileNames = Object.keys(version.code);
            if (fileNames.length > 0) setActiveFile(fileNames[0]);
            setShowVersionBrowser(false);
        }
    };

    const fetchVersions = useCallback(async () => {
        const { data } = await supabase
            .from('project_versions')
            .select('*')
            .eq('project_id', params.id)
            .order('created_at', { ascending: false });
        if (data) setVersions(data);
    }, [params.id]);

    // Initial Load: Hydrate project and messages
    useEffect(() => {
        const fetchProject = async () => {
            // Fetch Project Metadata
            const { data: projData } = await supabase
                .from('projects')
                .select('*')
                .eq('id', params.id)
                .single();

            if (projData) {
                setProject(projData);
                if (projData.latest_code && Object.keys(projData.latest_code).length > 0) {
                    setFiles(projData.latest_code);
                    const fileNames = Object.keys(projData.latest_code);
                    if (fileNames.length > 0) setActiveFile(fileNames[0]);
                }
            }

            // Fetch Messages
            const { data: msgData } = await supabase
                .from('messages')
                .select('*')
                .eq('project_id', params.id)
                .order('created_at', { ascending: true });

            if (msgData && msgData.length > 0) {
                setMessages(msgData);
            } else {
                // Default greeting
                setMessages([
                    { role: 'assistant', content: "Hi! I'm Demi. ready to help you build. What are we making today?" }
                ]);

                // If there's an initial prompt from URL, trigger it
                if (initialPrompt) {
                    handleSendMessage(initialPrompt);
                }
            }
            fetchVersions();
        };

        if (params.id) fetchProject();
    }, [params.id, initialPrompt]);

    const handleSendMessage = async (overridePrompt?: string) => {
        const messageText = overridePrompt || input;
        if (!messageText.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const newMsg = {
            project_id: params.id,
            user_id: user.id,
            role: 'user',
            content: messageText
        };

        // UI Update
        setMessages(prev => [...prev, newMsg]);
        if (!overridePrompt) setInput("");
        setIsGenerating(true);

        // Save User Message to DB
        await supabase.from('messages').insert(newMsg);

        try {
            const { data, error } = await supabase.functions.invoke('chat', {
                body: {
                    messages: overridePrompt ? [
                        { role: 'assistant', content: "Hi! I'm Demi. ready to help you build. What are we making today?" },
                        newMsg
                    ] : [...messages, newMsg],
                    model: selectedModel,
                    projectId: params.id
                }
            });

            if (error) throw error;
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    messages: overridePrompt ? [
                        { role: 'assistant', content: "Hi! I'm Demi. ready to help you build. What are we making today?" },
                        newMsg
                    ] : [...messages, newMsg],
                    model: selectedModel,
                    projectId: params.id
                })
            });

            if (!response.ok) throw new Error(response.statusText);

            setMessages(prev => [...prev, { role: 'assistant', content: "", model: selectedModel }]);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No reader");

            let aiContent = "";
            let currentFiles = { ...files };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiContent += chunk;

                // Real-time XML Parsing
                const fileRegex = /<file name="(.*?)">([\s\S]*?)<\/file>/g;
                let match;
                while ((match = fileRegex.exec(aiContent)) !== null) {
                    const [_, filename, content] = match;
                    currentFiles[filename] = content.trim();
                    if (!activeFile) setActiveFile(filename);
                }
                setFiles({ ...currentFiles });

                const intentMatch = aiContent.match(/<intent_graph>([\s\S]*?)<\/intent_graph>/);
                if (intentMatch) {
                    try {
                        const parsedIntent = JSON.parse(intentMatch[1]);
                        setIntent(parsedIntent);
                        const validation = validateIntent(parsedIntent);
                        setIntelligenceStatus(prev => ({ ...prev, intentLocked: validation.valid }));
                    } catch (e) { }
                }

                // Real-time Trust Report Parsing
                const trustMatch = aiContent.match(/<trust_report>([\s\S]*?)<\/trust_report>/);
                if (trustMatch) {
                    try {
                        const parsedTrust = JSON.parse(trustMatch[1]);
                        setTrustReport(parsedTrust);
                    } catch (e) { }
                }

                setMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1] = {
                        ...newArr[newArr.length - 1],
                        content: aiContent
                    };
                    return newArr;
                });
            }

            // After streaming: Sanitize Manifest and Save
            let finalFiles = { ...currentFiles };
            let permissionsPruned = false;
            if (finalFiles['manifest.json']) {
                try {
                    const manifestJson = JSON.parse(finalFiles['manifest.json']);
                    const originalPerms = JSON.stringify(manifestJson.permissions || []);
                    const sanitized = sanitizeManifest(manifestJson, finalFiles);
                    const newPerms = JSON.stringify(sanitized.permissions || []);

                    if (originalPerms !== newPerms) {
                        permissionsPruned = true;
                    }

                    finalFiles['manifest.json'] = JSON.stringify(sanitized, null, 2);
                } catch (e) {
                    console.error("Failed to sanitize manifest:", e);
                }
            }

            setFiles(finalFiles);

            // Run Guardrails
            const issues = validateGuardrails(finalFiles);
            setGuardrailIssues(issues);
            setIntelligenceStatus(prev => ({
                ...prev,
                permissionsPruned,
                guardrailsPassed: issues.length === 0
            }));

            await supabase.from('messages').insert({
                project_id: params.id,
                user_id: user.id,
                role: 'assistant',
                content: aiContent,
                model_used: selectedModel
            });

            await supabase.from('projects').update({
                latest_code: finalFiles,
                updated_at: new Date().toISOString()
            }).eq('id', params.id);

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I encountered an error connecting to the AI model. Please check the API Keys.",
                isError: true
            }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
            {/* LEFT PANEL: Workbench / Chat */}
            <div className="w-[400px] flex-shrink-0 flex flex-col border-r border-white/10 bg-[#0a0a0a]">
                {/* Header */}
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{project?.name || "Loading..."}</span>
                    </div>
                    <button className="text-neutral-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                    </button>
                </header>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-3", msg.role === 'assistant' ? "" : "flex-row-reverse")}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                msg.role === 'assistant' ? "bg-blue-600/20 text-blue-400" : "bg-neutral-800 text-neutral-400"
                            )}>
                                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={cn(
                                "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                                msg.role === 'assistant'
                                    ? "bg-transparent text-neutral-300"
                                    : "bg-neutral-800 text-white"
                            )}>
                                <div className="whitespace-pre-wrap">{msg.content.replace(/<file[\s\S]*?<\/file>/g, '')}</div> {/* Hide raw XML tags in chat */}
                                {msg.model && (
                                    <div className="mt-2 text-[10px] uppercase tracking-wider font-bold text-blue-500/50 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        {msg.model}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2 text-neutral-500 text-sm">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                    <div className="relative group bg-[#151515] border border-white/10 focus-within:border-blue-500/50 rounded-xl transition-all duration-200 shadow-lg shadow-black/50">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                            placeholder="Describe changes or features..."
                        />

                        {/* Intelligence Status Bar */}
                        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 bg-black/10">
                            <div className={cn(
                                "flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors",
                                intelligenceStatus.intentLocked ? "text-purple-400" : "text-neutral-600"
                            )}>
                                <Sparkles className="w-3 h-3" />
                                Intent Locked
                            </div>
                            <div className="w-1 h-1 rounded-full bg-neutral-800" />
                            <div className={cn(
                                "flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors",
                                intelligenceStatus.permissionsPruned ? "text-green-400" : "text-neutral-600"
                            )}>
                                <Zap className="w-3 h-3" />
                                Permissions Pruned
                            </div>
                            <div className="w-1 h-1 rounded-full bg-neutral-800" />
                            <div className={cn(
                                "flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors",
                                intelligenceStatus.guardrailsPassed ? "text-blue-400" : "text-red-400"
                            )}>
                                <Shield className="w-3 h-3" />
                                {intelligenceStatus.guardrailsPassed ? "Guardrails Passed" : "Security Flagged"}
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="px-3 pb-3 flex items-center justify-between">
                            {/* Model Selector */}
                            <div className="relative">
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="appearance-none bg-[#202020] hover:bg-[#252525] text-[11px] font-medium text-neutral-400 px-2 py-1.5 rounded-lg border border-white/5 cursor-pointer outline-none focus:border-blue-500/30 transition-colors pr-8"
                                >
                                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!input.trim()}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <span className="text-[10px] text-neutral-600 font-medium">
                            <span className="text-blue-500">Pro Plan</span> · 4,200 credits remaining
                        </span>
                    </div>

                    {/* Trust Report Preview Snippet */}
                    <AnimatePresence>
                        {trustReport && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-3 flex items-center justify-between px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-lg group cursor-pointer hover:bg-blue-500/10 transition-all"
                                onClick={() => setShowTrustReport(true)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Confidence</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${trustReport.confidence_score}%` }}
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        trustReport.confidence_score > 80 ? "bg-green-500" : trustReport.confidence_score > 60 ? "bg-yellow-500" : "bg-red-500"
                                                    )}
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-white/70">{trustReport.confidence_score}%</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-[10px] font-bold text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                                    View Report
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT PANEL: Preview / Code */}
            <div className="flex-1 flex flex-col bg-[#0f0f0f]">
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
                    <div className="flex bg-[#151515] p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                activeTab === 'preview' ? "bg-[#252525] text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                            )}
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                activeTab === 'code' ? "bg-[#252525] text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                            )}
                        >
                            Code
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-neutral-400 hover:text-white transition-colors bg-[#151515] hover:bg-[#1a1a1a] rounded-lg border border-white/5 uppercase tracking-wider disabled:opacity-50"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            {isSharing ? "Sharing..." : "Share"}
                        </button>
                        <button
                            onClick={handleSaveCheckpoint}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-neutral-400 hover:text-white transition-colors bg-[#151515] hover:bg-[#1a1a1a] rounded-lg border border-white/5 uppercase tracking-wider"
                        >
                            <Save className="w-3.5 h-3.5" />
                            Checkpoint
                        </button>
                        <button
                            onClick={handleFork}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-neutral-400 hover:text-white transition-colors bg-[#151515] hover:bg-[#1a1a1a] rounded-lg border border-white/5 uppercase tracking-wider"
                        >
                            <GitFork className="w-3.5 h-3.5" />
                            Fork
                        </button>
                        <button
                            onClick={() => setShowVersionBrowser(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-neutral-400 hover:text-white transition-colors bg-[#151515] hover:bg-[#1a1a1a] rounded-lg border border-white/5 uppercase tracking-wider"
                        >
                            <History className="w-3.5 h-3.5" />
                            History
                        </button>
                        <div className="w-px h-6 bg-white/5 mx-1" />
                        <button
                            onClick={handleDownloadZip}
                            disabled={Object.keys(files).length === 0}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2 px-4 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">Deploy</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    {activeTab === 'preview' ? (
                        <iframe
                            srcDoc={
                                // Simple In-Memory Preview: Inject CSS/JS into the HTML file found
                                files['popup.html']
                                    ? files['popup.html'].replace('</body>', `<style>${files['popup.css'] || ''}</style><script>${files['popup.js'] || ''}</script></body>`)
                                    : Object.keys(files).length > 0
                                        ? `<h1 style='color: white; text-align: center; margin-top: 20%; font-family: sans-serif'>No popup.html found. Displaying first file content: <pre>${Object.values(files)[0]}</pre></h1>`
                                        : "<h1 style='color: white; text-align: center; margin-top: 20%; font-family: sans-serif'>Generating...</h1>"
                            }
                            className="w-full h-full border-none bg-white"
                        />
                    ) : (
                        <div className="flex h-full">
                            {/* File Tree */}
                            <div className="w-48 border-r border-white/10 bg-[#151515] p-2 overflow-y-auto">
                                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 px-2">Files</h3>
                                {Object.keys(files).map(file => (
                                    <button
                                        key={file}
                                        onClick={() => setActiveFile(file)}
                                        className={cn("w-full text-left text-sm px-2 py-1.5 rounded hover:bg-white/5 truncate flex items-center gap-2", activeFile === file ? "text-blue-400 bg-blue-500/10" : "text-neutral-400")}
                                    >
                                        <Code2 className="w-3 h-3" /> {file}
                                    </button>
                                ))}
                                {Object.keys(files).length === 0 && <span className="text-neutral-600 text-xs px-2">No files yet</span>}
                            </div>
                            {/* Code Editor View */}
                            <div className="flex-1 p-4 overflow-auto font-mono text-sm text-neutral-300">
                                <pre>{activeFile ? files[activeFile] : "// Select a file to view content"}</pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <InstallationGuide
                isOpen={showInstallModal}
                onClose={() => setShowInstallModal(false)}
            />
            {/* Trust Report Slide-over */}
            <AnimatePresence>
                {showTrustReport && trustReport && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTrustReport(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="absolute top-0 right-0 w-full max-w-md h-full bg-[#0a0a0a] border-l border-white/10 z-[60] shadow-2xl overflow-y-auto"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setShowTrustReport(false)}
                                        className="p-2 -ml-2 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-all"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                        <Shield className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Intelligence Report</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-white brand-font">Build Confidence</h2>
                                    <div className="flex items-center gap-4 py-4 px-6 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-4xl font-black text-white font-mono">{trustReport.confidence_score}%</div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${trustReport.confidence_score}%` }}
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        trustReport.confidence_score > 80 ? "bg-green-500" : trustReport.confidence_score > 60 ? "bg-yellow-500" : "bg-red-500"
                                                    )}
                                                />
                                            </div>
                                            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">AI Reliability Rating</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <section className="space-y-3">
                                        <div className="flex items-center gap-2 text-neutral-400">
                                            <Bot className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">Architectural Rationale</h3>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm leading-relaxed text-neutral-300 italic">
                                            "{trustReport.rationale}"
                                        </div>
                                    </section>

                                    <section className="space-y-3">
                                        <div className="flex items-center gap-2 text-neutral-400">
                                            <Shield className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">Security & Permissions</h3>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm leading-relaxed text-neutral-300">
                                            {trustReport.security}
                                        </div>
                                    </section>

                                    {guardrailIssues.length > 0 && (
                                        <section className="space-y-3">
                                            <div className="flex items-center gap-2 text-red-400">
                                                <AlertTriangle className="w-4 h-4" />
                                                <h3 className="text-xs font-bold uppercase tracking-widest">Web Store Guardrails</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {guardrailIssues.map((issue, i) => (
                                                    <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                                                        {issue}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {trustReport.risks.length > 0 && (
                                        <section className="space-y-3">
                                            <div className="flex items-center gap-2 text-yellow-400">
                                                <Info className="w-4 h-4" />
                                                <h3 className="text-xs font-bold uppercase tracking-widest">Potential Risks</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {trustReport.risks.map((risk, i) => (
                                                    <li key={i} className="flex gap-2 text-xs text-neutral-400">
                                                        <span className="text-yellow-500">•</span>
                                                        {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowTrustReport(false)}
                                    className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-neutral-100 transition-all"
                                >
                                    Dismiss Report
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Version Browser Sidebar */}
            <AnimatePresence>
                {showVersionBrowser && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowVersionBrowser(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-2xl"
                        >
                            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f0f0f]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                                        <History className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-bold">Version History</h2>
                                </div>
                                <button
                                    onClick={() => setShowVersionBrowser(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {versions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4">
                                        <History className="w-12 h-12 opacity-20" />
                                        <p className="text-sm font-medium">No checkpoints saved yet.</p>
                                    </div>
                                ) : (
                                    versions.map((v) => (
                                        <div
                                            key={v.id}
                                            className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                                        {new Date(v.created_at).toLocaleDateString()} · {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-sm font-medium text-white">
                                                        Checkpoint {v.id.slice(0, 8)}
                                                    </div>
                                                    <div className="text-[11px] text-neutral-500">
                                                        {Object.keys(v.code).length} files included
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRestoreVersion(v)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                    Restore
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#0f0f0f]">
                                <p className="text-[11px] text-neutral-600 text-center leading-relaxed">
                                    Restoring a version will overwrite your current code.<br />
                                    We recommend saving a checkpoint of your current work first.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowShareModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#151515] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-600/20 text-purple-400 rounded-xl">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Share Project</h2>
                                        <p className="text-neutral-500 text-sm">Anyone with the link can view and download.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Public Link</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-neutral-300 font-mono truncate">
                                            {window.location.origin}/share/{shareSlug}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/share/${shareSlug}`);
                                                alert("Link copied!");
                                            }}
                                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all active:scale-95"
                                        >
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-600/5 border border-blue-600/10 rounded-2xl flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-blue-300/80 leading-relaxed">
                                        Shared projects include the latest version of your code and a README. Your API keys and secrets are never shared.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-all mt-4"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const InstallationGuide = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#151515] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Extension Ready!</h2>
                                    <p className="text-neutral-500 text-sm">Download successful. Follow these steps to use it:</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { step: "1", text: "Unzip the file you just downloaded." },
                                    { step: "2", text: "Open your browser and type chrome://extensions in the address bar." },
                                    { step: "3", text: "Enable 'Developer mode' in the top right corner." },
                                    { step: "4", text: "Click 'Load unpacked' and select the unzipped folder." }
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {item.step}
                                        </div>
                                        <p className="text-neutral-300 text-sm leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-all mt-4"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default function ProjectEditor({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">Loading Editor...</div>}>
            <ProjectEditorContent params={params} />
        </Suspense>
    );
}
