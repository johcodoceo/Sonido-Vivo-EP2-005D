/** Revisión estática de rutas de importación y JS; no es una compilación Vite. */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory() ? files(join(dir, item.name)) : [join(dir, item.name)]);
}
const sources = [...files('src'), ...files('scripts'), 'vite.config.js'];
const jsFiles = sources.filter((path) => /\.(?:js|jsx|mjs)$/.test(path));
const tests = jsFiles.filter((path) => path.endsWith('.test.js') || path.endsWith('.test.jsx'));
const issues = [];
let declaredTests = 0;
for (const path of jsFiles) {
  const content = readFileSync(path, 'utf8');
  if (tests.includes(path)) {
    declaredTests += (content.match(/\bit\s*\(/g) || []).length;
    declaredTests += (content.match(/\bit\.each\s*\(/g) || []).length;
    const disabled = content.match(/\b(?:it|test|describe)\.(?:skip|todo)\s*\(/g);
    if (disabled) issues.push(`${path}: ${disabled.length} pruebas/suites deshabilitadas`);
  }
  const imports = /\b(?:import|export)\s+(?:[^;]*?\s+from\s*)?['"](\.{1,2}\/[^'"]+)['"]/g;
  for (const match of content.matchAll(imports)) {
    const base = resolve(dirname(path), match[1]);
    const candidates = extname(base) ? [base] : [base, base + '.js', base + '.jsx', join(base, 'index.js'), join(base, 'index.jsx')];
    if (!candidates.some(existsSync)) issues.push(`${path}: import faltante: ${match[1]}`);
  }
  if (['.js', '.mjs'].includes(extname(path))) {
    const test = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    if (test.status !== 0) issues.push(`${path}: sintaxis JS: ${test.stderr.trim().slice(0, 300)}`);
  }
}
if (declaredTests < 10) issues.push(`Solo ${declaredTests} casos it()/it.each() localizados (mínimo 10)`);
const report = { generatedAt: new Date().toISOString(), srcCount: jsFiles.length, testFiles: tests.length, testDeclarations: declaredTests, check: 'JS sin JSX + imports relativos + pruebas no deshabilitadas', issues };
writeFileSync('docs/QA_ESTATICO_RESULTADOS.json', JSON.stringify(report, null, 2) + '\n');
console.log(`Archivos JS/JSX/MJS: ${jsFiles.length}. Archivos test: ${tests.length}. Declaraciones de prueba: ${declaredTests}.`);
console.log(issues.length ? issues.join('\n') : 'Sin errores de rutas relativas, JS o pruebas deshabilitadas. JSX/Vitest requieren npm.');
if (issues.length) process.exitCode = 1;
