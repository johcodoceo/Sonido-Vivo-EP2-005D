/** Comprobaciones verificables sin npm; NO reemplazan Vitest/RTL. */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const checks = ['check:catalog', 'check:cart', 'check:orders', 'check:users'];
const results = [];
for (const check of checks) {
  const result = spawnSync(process.execPath, [`scripts/${({
    'check:catalog': 'checkCatalog.mjs', 'check:cart': 'checkCart.mjs',
    'check:orders': 'checkOrders.mjs', 'check:users': 'checkUsers.mjs',
  })[check]}`], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 2_000_000 });
  const ok = result.status === 0;
  results.push({ check, ok, code: result.status, detail: (result.stdout + result.stderr).trim().slice(-3000) });
  console.log(`\n${ok ? 'APROBADO' : 'ERROR'} — ${check}\n${(result.stdout + result.stderr).trim()}`);
}
const report = { scope: 'Node sin Vitest, sin DOM y sin medición de cobertura React', generatedAt: new Date().toISOString(), results };
mkdirSync('docs', { recursive: true });
writeFileSync('docs/QA_NODE_RESULTADOS.json', JSON.stringify(report, null, 2) + '\n');
console.log(`\nResumen: ${results.filter((r) => r.ok).length}/${results.length} verificaciones Node aprobadas.`);
if (results.some((r) => !r.ok)) process.exitCode = 1;
