import fs from 'fs';

let c = fs.readFileSync('src/features/contacts/repository.ts', 'utf8');

c = c.replace(/await supabase\.from\('contact_types'\)/g, "await (supabase.from('contact_types') as any)");
c = c.replace(/await supabase\.from\('tags'\)/g, "await (supabase.from('tags') as any)");
c = c.replace(/let query = supabase\.from\('contact_interactions'\)/g, "let query = (supabase.from('contact_interactions') as any)");

fs.writeFileSync('src/features/contacts/repository.ts', c);
console.log('Fixed typings.');
