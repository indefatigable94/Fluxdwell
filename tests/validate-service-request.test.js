'use strict';

const assert = require('node:assert/strict');
const {
  validateServiceRequest,
  n8nValidateFromWebhook,
} = require('../lib/validate-service-request');
const sample = require('../samples/sample-request.json');

function run(name, fn) {
  try {
    fn();
    console.log(`PASS  ${name}`);
  } catch (err) {
    console.error(`FAIL  ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

run('golden path returns received without echoing PII', () => {
  const result = validateServiceRequest(sample, { now: 1710000001042 });
  assert.equal(result.status, 'received');
  assert.equal(result.confirmation_reference, 'DEMO-001042');
  assert.equal(result.lead, undefined);
  assert.equal(result.caller_name, undefined);
  assert.equal(result.phone, undefined);
});

run('missing phone returns needs_human', () => {
  const payload = { ...sample };
  delete payload.phone;
  const result = validateServiceRequest(payload);
  assert.equal(result.status, 'needs_human');
  assert.deepEqual(result.missing_fields, ['phone']);
});

run('empty string counts as missing', () => {
  const result = validateServiceRequest({ ...sample, caller_name: '   ' });
  // trimmed empty still present as string — invalid after type check
  // wait: '   ' is not === '' so missing won't catch it; invalid will
  assert.equal(result.status, 'needs_human');
  assert.ok(result.invalid_fields.includes('caller_name'));
});

run('invalid service_type is rejected', () => {
  const result = validateServiceRequest({ ...sample, service_type: 'lawn' });
  assert.equal(result.status, 'needs_human');
  assert.ok(result.invalid_fields.includes('service_type'));
});

run('invalid urgency is rejected', () => {
  const result = validateServiceRequest({ ...sample, urgency: 'soon' });
  assert.equal(result.status, 'needs_human');
  assert.ok(result.invalid_fields.includes('urgency'));
});

run('existing_customer must be boolean', () => {
  const result = validateServiceRequest({ ...sample, existing_customer: 'yes' });
  assert.equal(result.status, 'needs_human');
  assert.ok(result.invalid_fields.includes('existing_customer'));
});

run('n8n wrapper reads body envelope', () => {
  const out = n8nValidateFromWebhook({ body: sample }, { now: 1000000000123 });
  assert.equal(out[0].json.status, 'received');
  assert.equal(out[0].json.confirmation_reference, 'DEMO-000123');
});

run('missing existing_customer is flagged', () => {
  const payload = { ...sample };
  delete payload.existing_customer;
  const result = validateServiceRequest(payload);
  assert.equal(result.status, 'needs_human');
  assert.ok(result.missing_fields.includes('existing_customer'));
});

if (!process.exitCode) {
  console.log('\nAll validation tests passed.');
}
