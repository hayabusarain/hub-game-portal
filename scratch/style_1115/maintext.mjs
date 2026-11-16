import fs from 'node:fs';
const html = fs.readFileSync(0, 'utf8');
const m = html.match(/<main[\s\S]*<\/main>/i); let s = m ? m[0] : html;
const i = s.search(/<footer/i); if (i > 0) s = s.slice(0, i);
s = s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<h([1-6])[^>]*>/gi, '\n\n[h$1] ').replace(/<(\/p|\/li|\/tr|br|\/div|\/dd|\/dt|\/h[1-6])[^>]*>/gi, '\n').replace(/<\/t[dh]>/gi, ' | ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
console.log(s.split('\n').map((x) => x.trim()).filter(Boolean).join('\n'));
