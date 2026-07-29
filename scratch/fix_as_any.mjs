import fs from 'fs';
import path from 'path';

const dir = 'src';

function walk(d) {
  const files = fs.readdirSync(d);
  for (const f of files) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      const c = fs.readFileSync(p, 'utf8');
      if (c.includes('as any')) {
        console.log(p);
      }
    }
  }
}

walk(dir);
