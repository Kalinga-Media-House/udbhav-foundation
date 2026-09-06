import React from 'react';

// Strict regex-based HTML sanitizer for admin-trusted input
function strictSanitize(html: string): string {
  if (!html) return '';
  
  // 1. Remove script tags and their content entirely first
  let safe = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 2. Whitelist
  const allowedTags = /^<\/?(p|b|strong|i|em|u|strike|s|ul|ol|li|h[2-6]|blockquote|br|a|div|span)(?:\s+[^>]*)?>$/i;
  
  safe = safe.replace(/<[^>]+>/g, (match) => {
    if (allowedTags.test(match)) {
      if (match.toLowerCase().startsWith('<a ')) {
        const hrefMatch = match.match(/href\s*=\s*["']([^"']+)["']/i);
        if (hrefMatch && hrefMatch[1]) {
          let href = hrefMatch[1];
          if (/^(https?:\/\/|mailto:)/i.test(href)) {
            href = href.replace(/"/g, '&quot;');
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">`;
          }
        }
        return '<a>';
      }
      
      const tagNameMatch = match.match(/<\/?([a-z0-9]+)/i);
      if (tagNameMatch) {
        const tagName = tagNameMatch[1].toLowerCase();
        const isClosing = match.startsWith('</');
        return isClosing ? `</${tagName}>` : `<${tagName}>`;
      }
    }
    return '';
  });

  return safe;
}

export function SafeHtml({ html, className = '' }: { html: string, className?: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(html);
  
  if (!isHtml) {
    return (
      <div className={`${className} whitespace-pre-wrap`}>
        {html}
      </div>
    );
  }

  const sanitized = strictSanitize(html);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}