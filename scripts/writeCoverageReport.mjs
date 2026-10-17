/** Genera un resumen SOLO después de ejecutar Vitest coverage realmente. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const file = resolve('coverage/coverage-summary.json');
if (!existsSync(file)) {
  console.error('No existe coverage/coverage-summary.json. Ejecuta primero: npm run test:coverage');
  process.exit(1);
}
const summary = JSON.parse(readFileSync(file, 'utf8'));
if (!summary.total || !['statements','branches','functions','lines'].every((key) => Number.isFinite(summary.total[key]?.pct))) {
  console.error('Resumen de cobertura inválido. Revisa la ejecución de Vitest.');
  process.exit(1);
}
const metric = { statements: 'Statements', branches: 'Branches', functions: 'Functions', lines: 'Lines' };
const rows = Object.entries(metric).map(([key, label]) => `| ${label} | ${summary.total[key].pct.toFixed(2)} % | ${summary.total[key].covered}/${summary.total[key].total} |`);
const details = Object.entries(summary).filter(([name]) => name !== 'total').map(([name, x]) => ({ name: name.replace(process.cwd(), '.'), lines: x.lines?.pct ?? 0 })).sort((a,b)=>a.lines-b.lines);
const low = details.slice(0, 8).map(x => `- ${x.name}: líneas ${x.lines.toFixed(2)} %`).join('\n');
const markdown = `# Reporte de cobertura REAL · Sonido Vivo EP2\n\nGenerado automáticamente desde \`coverage/coverage-summary.json\` por \`npm run report:coverage\`.\nNo reemplaza el análisis del equipo ni la evidencia de terminal.\n\n| Métrica | Cobertura | Ejecutado/cubierto |\n|---|---:|---:|\n${rows.join('\n')}\n\n## Archivos con menor cobertura de líneas\n${low || 'No hay desglose por archivo.'}\n\nLa cobertura es una medida de código ejercitado, no garantía de ausencia de defectos.\n`;
writeFileSync('docs/EP2_COBERTURA_MEDIDA.md', markdown);
console.log(markdown);
