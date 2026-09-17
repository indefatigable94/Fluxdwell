'use strict';

const REQUIRED = [
  'caller_name',
  'phone',
  'address_or_zip',
  'service_type',
  'issue_summary',
  'urgency',
  'preferred_window',
  'existing_customer',
];

const SERVICE_TYPES = new Set(['HVAC', 'plumbing', 'electrical', 'other']);
const URGENCIES = new Set(['emergency', 'same_day', 'routine']);

/**
 * Validate a Retell create_service_request payload.
 * Returns a minimal JSON body for Retell — never echoes full PII.
 */
function validateServiceRequest(rawInput, options = {}) {
  const input = rawInput && typeof rawInput === 'object' ? rawInput : {};
  const now = options.now || Date.now();

  const missing = [];
  const invalid = [];

  for (const key of REQUIRED) {
    const value = input[key];
    if (value === undefined || value === null || value === '') {
      missing.push(key);
    }
  }

  for (const key of [
    'caller_name',
    'phone',
    'address_or_zip',
    'issue_summary',
    'preferred_window',
  ]) {
    if (missing.includes(key)) continue;
    if (typeof input[key] !== 'string' || !input[key].trim()) {
      invalid.push(key);
    }
  }

  if (!missing.includes('service_type') && !SERVICE_TYPES.has(input.service_type)) {
    invalid.push('service_type');
  }

  if (!missing.includes('urgency') && !URGENCIES.has(input.urgency)) {
    invalid.push('urgency');
  }

  if (!missing.includes('existing_customer') && typeof input.existing_customer !== 'boolean') {
    invalid.push('existing_customer');
  }

  if (missing.length || invalid.length) {
    const body = {
      status: 'needs_human',
      message:
        'The service request is missing or invalid information and needs human follow-up.',
    };
    if (missing.length) body.missing_fields = missing;
    if (invalid.length) body.invalid_fields = invalid;
    return body;
  }

  return {
    status: 'received',
    confirmation_reference: `DEMO-${String(now).slice(-6)}`,
    message: 'The service request was received for human scheduling review.',
  };
}

/**
 * n8n Code node entry: unwrap body and validate.
 * Keep in sync with the jsCode string in the workflow JSON.
 */
function n8nValidateFromWebhook(itemJson, options = {}) {
  const input = itemJson.body ?? itemJson;
  return [{ json: validateServiceRequest(input, options) }];
}

module.exports = {
  REQUIRED,
  SERVICE_TYPES,
  URGENCIES,
  validateServiceRequest,
  n8nValidateFromWebhook,
};
