/**
 * Copy-to-clipboard functionality for code blocks
 * Injects copy buttons into Shiki-generated .astro-code blocks
 */

/**
 * Injects CSS styles for copy buttons into the document head
 * Only runs once per page (checks for existing style element)
 */
function injectStyles(): void {
  if (document.getElementById('copy-button-styles')) return;

  const style = document.createElement('style');
  style.id = 'copy-button-styles';
  style.textContent = `
.code-block-wrapper {
  position: relative;
}

.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-header-bg);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: inherit;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease;
  z-index: 10;
}

.code-block-wrapper:hover .copy-button,
.copy-button:focus {
  opacity: 1;
}

.copy-button:hover {
  background: var(--color-link);
  color: #fff;
  border-color: var(--color-link);
}

.copy-button:focus {
  outline: 2px solid var(--color-link);
  outline-offset: 2px;
}

.copy-button.copy-success {
  opacity: 1;
  background: #28a745;
  color: #fff;
  border-color: #28a745;
}

.copy-button.copy-error {
  opacity: 1;
  background: #dc3545;
  color: #fff;
  border-color: #dc3545;
}
`;

  document.head.appendChild(style);
}

/**
 * Initializes copy buttons for all .astro-code blocks on the page
 * Idempotent: skips blocks that already have a copy button
 */
export function initCopyButtons(): void {
  // Inject styles first
  injectStyles();

  // Find all Shiki-generated code blocks
  const codeBlocks = document.querySelectorAll<HTMLPreElement>('.astro-code');

  codeBlocks.forEach((codeBlock) => {
    // Skip if already wrapped (idempotent)
    if (codeBlock.parentElement?.classList.contains('code-block-wrapper')) {
      return;
    }

    // Get code text content
    const codeText = codeBlock.textContent || '';

    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    // Insert wrapper before the pre element
    codeBlock.parentNode?.insertBefore(wrapper, codeBlock);

    // Move pre inside wrapper
    wrapper.appendChild(codeBlock);

    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.textContent = 'Copy';

    // Add click handler
    button.addEventListener('click', async () => {
      try {
        // Get current code text (in case it's been modified)
        const currentCode = codeBlock.textContent || '';

        // Copy to clipboard
        await navigator.clipboard.writeText(currentCode);

        // Success feedback
        button.textContent = 'Copied!';
        button.classList.add('copy-success');
        button.setAttribute('aria-label', 'Code copied to clipboard');

        // Reset after 2 seconds
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('copy-success');
          button.setAttribute('aria-label', 'Copy code to clipboard');
        }, 2000);
      } catch (error) {
        // Error feedback
        console.error('Failed to copy code:', error);
        button.textContent = 'Failed';
        button.classList.add('copy-error');

        // Reset after 2 seconds
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('copy-error');
          button.setAttribute('aria-label', 'Copy code to clipboard');
        }, 2000);
      }
    });

    // Insert button as first child of wrapper (before pre)
    wrapper.insertBefore(button, codeBlock);
  });
}
