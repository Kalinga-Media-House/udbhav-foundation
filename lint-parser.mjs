import fs from 'fs';
const data = JSON.parse(fs.readFileSync('lint.json', 'utf8'));
data.forEach(f => {
  const errors = f.messages.filter(m => m.severity === 2);
  if (errors.length > 0) {
    console.log(f.filePath);
    errors.forEach(e => console.log(`  ${e.line}:${e.column} - ${e.ruleId} (${e.message})`));
  }
});
