/**
 * Demi IO - AI Guardrails v2
 * High-fidelity safety scanning for Chrome Extensions.
 */

export interface SafetyIssue {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    file?: string;
    line?: number;
    category: 'security' | 'compliance' | 'performance';
}

export function performSafetyAudit(files: Record<string, string>): SafetyIssue[] {
    const issues: SafetyIssue[] = [];

    // 1. Manifest Audit
    if (files['manifest.json']) {
        try {
            const manifest = JSON.parse(files['manifest.json']);

            // Broad Permissions
            const broadPerms = ['<all_urls>', 'http://*/*', 'https://*/*'];
            const hostPerms = manifest.host_permissions || [];
            if (hostPerms.some((p: string) => broadPerms.includes(p))) {
                issues.push({
                    id: 'broad-host-permissions',
                    severity: 'warning',
                    title: 'Broad Host Permissions',
                    message: 'Using broad host permissions (e.g., <all_urls>) may delay Web Store review. Consider narrowing scope.',
                    file: 'manifest.json',
                    category: 'compliance'
                });
            }

            // Dangerous Permissions
            const dangerousPerms = ['identity', 'topSites', 'management', 'proxy'];
            const permissions = manifest.permissions || [];
            permissions.forEach((p: string) => {
                if (dangerousPerms.includes(p)) {
                    issues.push({
                        id: `dangerous-perm-${p}`,
                        severity: 'info',
                        title: `Powerful Permission: ${p}`,
                        message: `The '${p}' permission is highly privileged. Ensure it is strictly necessary for your features.`,
                        file: 'manifest.json',
                        category: 'security'
                    });
                }
            });

            // Manifest Version
            if (manifest.manifest_version !== 3) {
                issues.push({
                    id: 'legacy-manifest',
                    severity: 'critical',
                    title: 'Legacy Manifest Version',
                    message: 'Manifest V2 is deprecated. Extensions must use Manifest V3 for future compatibility.',
                    file: 'manifest.json',
                    category: 'compliance'
                });
            }
        } catch (e) {
            issues.push({
                id: 'manifest-invalid',
                severity: 'critical',
                title: 'Invalid JSON',
                message: 'Your manifest.json is not a valid JSON file and will cause the extension to fail.',
                file: 'manifest.json',
                category: 'compliance'
            });
        }
    }

    // 2. Code Content Audit (Regex based for MVP)
    Object.entries(files).forEach(([filename, content]) => {
        if (filename.endsWith('.js')) {
            // Unsafe Execution
            if (content.includes('eval(') || content.includes('new Function(')) {
                issues.push({
                    id: 'unsafe-execution',
                    severity: 'critical',
                    title: 'Unsafe Code Execution',
                    message: 'Use of eval() or new Function() is strictly forbidden in most Chrome Extension contexts for security reasons.',
                    file: filename,
                    category: 'security'
                });
            }

            // Insecure DOM Manipulation
            if (content.includes('.innerHTML =') || content.includes('.outerHTML =')) {
                issues.push({
                    id: 'insecure-dom',
                    severity: 'warning',
                    title: 'Insecure DOM Manipulation',
                    message: 'Using innerHTML can lead to XSS vulnerabilities. Consider using textContent or element.setHTML() where available.',
                    file: filename,
                    category: 'security'
                });
            }

            // Storage leaks
            if (content.includes('localStorage.')) {
                issues.push({
                    id: 'storage-leak',
                    severity: 'info',
                    title: 'Synchronous Storage',
                    message: 'localStorage is synchronous and can block the main thread. Consider using chrome.storage.local for extensions.',
                    file: filename,
                    category: 'performance'
                });
            }
        }
    });

    return issues;
}
