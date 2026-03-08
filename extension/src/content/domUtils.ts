// src/content/domUtils.ts

/**
 * Extracts interesting parts of the DOM that might contain malicious code or prompts.
 */
export function extractPageContext(): string {
    const context: string[] = [];

    // 1. Get visible text
    context.push("--- VISIBLE TEXT ---");
    context.push(document.body.innerText.slice(0, 2000));

    // 2. Get meta tags (can contain hidden prompts or instructions)
    context.push("--- META TAGS ---");
    const metaTags = Array.from(document.getElementsByTagName('meta'))
        .map(m => `${m.getAttribute('name') || m.getAttribute('property')}: ${m.getAttribute('content')}`)
        .join('\n');
    context.push(metaTags.slice(0, 500));

    // 3. Get scripts (especially inline ones)
    context.push("--- INLINE SCRIPTS ---");
    const inlineScripts = Array.from(document.getElementsByTagName('script'))
        .filter(s => !s.src && s.textContent)
        .map(s => s.textContent?.trim())
        .filter(t => t && t.length > 20)
        .join('\n\n')
        .slice(0, 1500);
    context.push(inlineScripts);

    // 4. Get inline styles (sometimes used for UI redressing)
    context.push("--- INLINE STYLES ---");
    const inlineStyles = Array.from(document.getElementsByTagName('style'))
        .map(s => s.textContent?.trim())
        .filter(t => t && t.length > 20)
        .join('\n\n')
        .slice(0, 500);
    context.push(inlineStyles);

    return context.join('\n\n').slice(0, 6000); // Overall limit to keep it fast
}

/**
 * Blurs or removes elements containing specific text.
 */
export function mitigateContent(textContext: string, mode: 'blur' | 'remove' = 'blur') {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    const targets: HTMLElement[] = [];

    while ((node = walker.nextNode())) {
        if (node.textContent?.includes(textContext)) {
            const parent = node.parentElement;
            if (parent && !['SCRIPT', 'STYLE', 'HEAD'].includes(parent.tagName)) {
                targets.push(parent);
            }
        }
    }

    targets.forEach(el => {
        if (mode === 'blur') {
            el.classList.add('websec-sanitized');
        } else {
            el.style.display = 'none';
            // Or completely remove: el.remove();
        }
    });
}
