'use strict';

/**
 * Local demo of the same validation Retell hits in n8n.
 * Run: npm run demo:validate
 */
const fs = require('node:fs');
const path = require('node:path');
const { validateServiceRequest } = require('../lib/validate-service-request');

const root = path.join(__dirname, '..');
const sample = JSON.parse(
  fs.readFileSync(path.join(root, 'samples/sample-request.json'), 'utf8')
);

const golden = validateServiceRequest(sample, { now: 1710000001042 });
const missingPhone = { ...sample };
delete missingPhone.phone;
const failure = validateServiceRequest(missingPhone);

const report = {
  demo: 'retell-n8n-validation',
  ran_at: new Date().toISOString(),
  note: 'Local executable proof. Live Retell/n8n screenshots go in docs/assets/ when dashboards are reachable.',
  golden_path: {
    input_keys: Object.keys(sample),
    response: golden,
  },
  failure_path: {
    scenario: 'missing phone',
    response: failure,
  },
};

const outPath = path.join(root, 'docs/assets/demo-validation-run.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
console.log(`\nWrote ${outPath}`);
