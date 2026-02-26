"use client";

import React, { useState, useEffect } from "react";
import {
    Globe,
    RotateCcw,
    ArrowLeft,
    ArrowRight,
    Lock,
    MoreVertical,
    Puzzle,
    ExternalLink,
    MousePointer2,
    Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewShellProps {
    files: Record<string, string>;
    targetUrl?: string;
    onUrlChange?: (url: string) => void;
}

export function PreviewShell({ files, targetUrl = "https://example.com", onUrlChange }: PreviewShellProps) {
    const [viewMode, setViewMode] = useState<"popup" | "content">("popup");
    const [url, setUrl] = useState(targetUrl);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Simulated Chrome API Injection Script
    const chromeMockScript = `
        (function() {
            window.chrome = {
                runtime: {
                    sendMessage: (msg, callback) => {
                        console.log("[Chrome Mock] sendMessage:", msg);
                        if (callback) setTimeout(() => callback({ success: true }), 100);
                    },
                    onMessage: {
                        addListener: (fn) => console.log("[Chrome Mock] onMessage listener added")
                    }
                },
                storage: {
                    local: {
                        get: (key, cb) => {
                            const data = JSON.parse(localStorage.getItem('demi_mock_storage') || '{}');
                            cb(key ? { [key]: data[key] } : data);
                        },
                        set: (data, cb) => {
                            const current = JSON.parse(localStorage.getItem('demi_mock_storage') || '{}');
                            localStorage.setItem('demi_mock_storage', JSON.stringify({ ...current, ...data }));
                            if (cb) cb();
                        }
                    }
                },
                tabs: {
                    query: (query, cb) => {
                        cb([{ id: 1, url: window.location.href, title: document.title }]);
                    }
                }
            };
            console.log("[Demi] Chrome APIs Injected");
        })();
    `;

    const getPopupContent = () => {
        if (!files['popup.html']) return `<div style='background: white; color: #999; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-weight: 700; font-size: 12px;'>No popup.html generated</div>`;

        let content = files['popup.html'];
        const headEnd = content.indexOf('</head>');
        const injection = `<script>${chromeMockScript}</script><style>${files['popup.css'] || ''}</style>`;

        if (headEnd !== -1) {
            content = content.slice(0, headEnd) + injection + content.slice(headEnd);
        } else {
            content = injection + content;
        }

        const bodyEnd = content.indexOf('</body>');
        if (bodyEnd !== -1) {
            content = content.slice(0, bodyEnd) + `<script>${files['popup.js'] || ''}</script>` + content.slice(bodyEnd);
        } else {
            content += `<script>${files['popup.js'] || ''}</script>`;
        }

        return content;
    };

    const getContentScriptContent = () => {
        // Simple mock of a target website with common elements for content script testing
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Preview: ${url}</title>
                    <script>${chromeMockScript}</script>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; color: #333; background: #f9fafb; }
                        header { margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                        h1 { font-weight: 900; letter-spacing: -0.02em; }
                        .demo-card { background: white; border: 1px solid #e5e7eb; padding: 24px; rounded: 12px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                        .price-tag { font-weight: 700; color: #10b981; }
                        button { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <header>
                        <h1>Target Site Simulation</h1>
                        <p>This is a sandbox representing <code>${url}</code></p>
                    </header>
                    <div class="demo-card">
                        <h3>Item Name</h3>
                        <p>Demo item description that a content script might interact with.</p>
                        <span class="price-tag">$49.99</span>
                        <button>Buy Now</button>
                    </div>
                    <div class="demo-card">
                        <h3>Another Section</h3>
                        <p>More content to scrape or modify.</p>
                        <span class="price-tag">$129.00</span>
                    </div>
                    <script>${files['content.js'] || ''}</script>
                </body>
            </html>
        `;
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    return (
        <div className="flex flex-col h-full bg-neutral-100/50">
            {/* Browser Header */}
            <div className="flex flex-col gap-2 p-3 bg-white border-b border-neutral-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1.5 px-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400">
                                <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={handleRefresh}
                                className={cn("p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400", isRefreshing && "animate-spin")}
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                        <button
                            onClick={() => setViewMode("popup")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                viewMode === 'popup' ? "bg-white text-blue-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            <Puzzle className="w-3 h-3" />
                            Popup
                        </button>
                        <button
                            onClick={() => setViewMode("content")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                viewMode === 'content' ? "bg-white text-blue-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            <Layers className="w-3 h-3" />
                            Content
                        </button>
                    </div>

                    <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400">
                        <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4 py-1.5 bg-neutral-100 border border-neutral-200 rounded-xl">
                        <Lock className="w-3 h-3 text-neutral-400" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onBlur={() => onUrlChange?.(url)}
                            className="bg-transparent border-none focus:ring-0 text-[11px] font-medium text-neutral-600 w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Browser Tab Body */}
            <div className="flex-1 relative bg-white overflow-hidden">
                <AnimatePresence mode="wait">
                    {isRefreshing ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                            <RotateCcw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Re-injecting Scripts...</span>
                        </div>
                    ) : viewMode === 'popup' ? (
                        <div className="absolute inset-0 flex items-start justify-end p-4 pointer-events-none">
                            <div className="w-[360px] h-fit max-h-[500px] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="h-8 bg-neutral-50 border-b border-neutral-100 flex items-center px-3 justify-between">
                                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Extension Popup</span>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                                    </div>
                                </div>
                                <iframe
                                    srcDoc={getPopupContent()}
                                    className="w-full h-[400px] border-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <iframe
                            srcDoc={getContentScriptContent()}
                            className="w-full h-full border-none"
                        />
                    )}
                </AnimatePresence>

                {/* Visual Indicators Overlay */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-xl shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Chrome Environment Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
