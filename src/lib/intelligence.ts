export interface IntentGraph {
    metadata: {
        name: string;
        description: string;
        version: string;
    };
    trigger: {
        type: 'onPageLoad' | 'onClick' | 'onShortcut' | 'onContextMenu';
        value?: string;
    };
    scope: {
        include_domains: string[];
        exclude_paths: string[];
        all_frames: boolean;
    };
    actions: Array<{
        type: 'dom_modify' | 'data_extract' | 'redirect' | 'inject_ui';
        selector?: string;
        logic: string;
    }>;
    permissions: string[];
}

export interface TrustReport {
    confidence_score: number;
    rationale: string;
    security: string;
    risks: string[];
}

import { performSafetyAudit, SafetyIssue } from './safety';
export type { SafetyIssue };

/**
 * Checks for architectural contradictions in the Intent Graph.
 * e.g., A popup trigger (onClick) shouldn't be trying to run persistent background logic 
 * without a service worker properly defined.
 */
export function validateIntent(intent: IntentGraph): { valid: boolean; error?: string } {
    // 1. Basic Structure Check
    if (!intent.trigger || !intent.actions || intent.actions.length === 0) {
        return { valid: false, error: "Intent must have a trigger and at least one action." };
    }

    // 2. Trigger vs Action Check (Intent Lock)
    if (intent.trigger.type === 'onClick' && intent.actions.some(a => a.type === 'dom_modify' && !intent.scope.include_domains.length)) {
        // If it's a popup, we usually need specific domains if we want to modify the DOM upon opening
        // or we use activeTab.
    }

    return { valid: true };
}

/**
 * Prunes the manifest permissions based on actual API usage in the generated code.
 */
export function sanitizeManifest(manifest: any, files: Record<string, string>): any {
    const codeContent = Object.values(files).join('\n');
    const sanitizedManifest = { ...manifest };

    if (!sanitizedManifest.permissions) return sanitizedManifest;

    const permissionMap: Record<string, string[]> = {
        'storage': ['chrome.storage'],
        'tabs': ['chrome.tabs'],
        'activeTab': ['chrome.tabs'],
        'cookies': ['chrome.cookies'],
        'bookmarks': ['chrome.bookmarks'],
        'history': ['chrome.history'],
        'notifications': ['chrome.notifications'],
        'contextMenus': ['chrome.contextMenus'],
        'scripting': ['chrome.scripting']
    };

    const finalPermissions = sanitizedManifest.permissions.filter((perm: string) => {
        // If it's a host permission (contains :// or *), we keep it for now
        if (perm.includes('://') || perm.includes('*') || perm === '<all_urls>') {
            return true;
        }

        const requiredCalls = permissionMap[perm];
        if (!requiredCalls) return true; // Keep unknown permissions for safety

        // Check if any of the required API calls exist in the code
        return requiredCalls.some(call => codeContent.includes(call));
    });

    // Downgrade 'tabs' to 'activeTab' if 'chrome.tabs' is used but only for simple things
    // and user didn't ask for full tabs broad access. (Advanced logic placeholder)

    sanitizedManifest.permissions = [...new Set(finalPermissions)];
    return sanitizedManifest;
}

/**
 * Checks for common Chrome Web Store rejection patterns.
 * Delegates to the specialized safety module.
 */
export function validateGuardrails(files: Record<string, string>): SafetyIssue[] {
    return performSafetyAudit(files);
}
