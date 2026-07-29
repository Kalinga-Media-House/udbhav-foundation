import fs from 'fs';
import path from 'path';

const basePath = 'c:/Projects/udbhav-foundation/src/features/contacts';

let repo = fs.readFileSync(path.join(basePath, 'repository.ts'), 'utf-8');

// Fix string -> Error mapping
repo = repo.replace(/error: error\.message/g, 'error: new Error(error.message)');
repo = repo.replace(/error: 'Database error'/g, "error: new Error('Database error')");

// Fix insert/update typings
repo = repo.replace(/insert\(data\)/g, 'insert(data as any)');
repo = repo.replace(/update\(data\)/g, 'update(data as any)');

// Fix Pagination structure
repo = repo.replace(/data: \{\s*data: data as any\[\],\s*meta: \{ page, limit, total: count \?\? 0, totalPages: Math\.ceil\(\(count \?\? 0\) \/ limit\) \}\s*\}/, 
"data: { data: data as any[], total: count ?? 0, page, limit }");

fs.writeFileSync(path.join(basePath, 'repository.ts'), repo);

let service = fs.readFileSync(path.join(basePath, 'service.ts'), 'utf-8');
service = service.replace(/createContactType\(parsed\.data\)/g, "createContactType(parsed.data as any)");
service = service.replace(/updateContactType\(id, parsed\.data\)/g, "updateContactType(id, parsed.data as any)");
service = service.replace(/createTag\(parsed\.data\)/g, "createTag(parsed.data as any)");
service = service.replace(/updateTag\(id, parsed\.data\)/g, "updateTag(id, parsed.data as any)");
fs.writeFileSync(path.join(basePath, 'service.ts'), service);

console.log('Fixed types!');
