/**
 * Knowledge base of reliable CSS selectors and patterns for popular target sites.
 * This helps the AI build working extensions without needing a live crawl every time.
 */
export const SITE_KNOWLEDGE_BASE: Record<string, {
    selectors: Record<string, string>;
    hints: string[];
    permissions?: string[];
}> = {
    'amazon.com': {
        selectors: {
            price: '#corePrice_feature_div .a-price-whole, #priceblock_ourprice',
            title: '#productTitle',
            addToCart: '#add-to-cart-button',
            buyNow: '#buy-now-button'
        },
        hints: [
            "Use MutationObserver to watch for dynamic price changes.",
            "Identify product variants using the ASIN in the URL or 'data-asin' attributes."
        ],
        permissions: ['unlimitedStorage']
    },
    'youtube.com': {
        selectors: {
            videoPlayer: 'video.html5-main-video',
            channelName: '#channel-name a',
            subscribeButton: 'ytd-subscribe-button-renderer',
            comments: 'ytd-comments'
        },
        hints: [
            "Wait for 'yt-navigate-finish' event for reliable DOM access in SPAs.",
            "Use the 'ytd-app' element for global site state."
        ]
    },
    'github.com': {
        selectors: {
            repoName: "strong[itemprop='name'] a",
            cloneUrl: 'input[aria-label="Clone and HTTPS url"]',
            fileContent: '.blob-wrapper table',
            newIssue: "a[data-hotkey='c']"
        },
        hints: [
            "GitHub uses Turbo/Pjax, listen for 'turbo:load' instead of simple window.onload.",
            "SVG icons often have 'octicon' class."
        ]
    }
};

/**
 * Heuristic patterns for sites not in the knowledge base.
 */
export const SITE_HEURISTICS = [
    { pattern: /price|cost|amount/i, advice: "Look for elements with 'price' in class/id or currency symbols." },
    { pattern: /checkout|cart|buy|basket/i, advice: "Look for buttons with 'cart' or 'buy' labels or aria-labels." },
    { pattern: /search|query/i, advice: "Identify input types like 'search' or elements with name='q'." }
];

/**
 * Derives site-specific knowledge from a user prompt or URL.
 */
export function getSiteContext(prompt: string): string {
    let context = "### SITE-AWARE INTELLIGENCE\n";
    let found = false;

    // 1. Check knowledge base
    for (const [domain, info] of Object.entries(SITE_KNOWLEDGE_BASE)) {
        if (prompt.toLowerCase().includes(domain)) {
            found = true;
            context += `Context for ${domain}:\n`;
            context += `- Reliable Selectors: ${JSON.stringify(info.selectors)}\n`;
            context += `- Expert Hints: ${info.hints.join(' ')}\n`;
            if (info.permissions) {
                context += `- Recommended Permissions: ${info.permissions.join(', ')}\n`;
            }
        }
    }

    // 2. Check heuristics
    for (const h of SITE_HEURISTICS) {
        if (h.pattern.test(prompt)) {
            if (!found) context += "General Guidance:\n";
            context += `- ${h.advice}\n`;
            found = true;
        }
    }

    return found ? context : "";
}
