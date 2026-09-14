// Provider messages may echo recipients or request content. Emit only fixed vocabulary.
const names = new Set(['validation_error', 'missing_api_key', 'invalid_api_key', 'restricted_api_key', 'invalid_access', 'rate_limit_exceeded', 'daily_quota_exceeded', 'monthly_quota_exceeded', 'application_error', 'internal_server_error', 'invalid_parameter', 'missing_required_field', 'invalid_idempotent_request', 'concurrent_idempotent_requests', 'TimeoutError', 'AbortError', 'TypeError']);
export function emailDiagnostic(error: unknown) {
  const value = error && typeof error === 'object' ? error as Record<string, unknown> : {};
  const message = typeof value.message === 'string' ? value.message : '';
  const errorName = typeof value.name === 'string' && names.has(value.name) ? value.name : 'unknown_error';
  const statusCode = typeof value.statusCode === 'number' && Number.isInteger(value.statusCode) && value.statusCode >= 400 && value.statusCode <= 599 ? value.statusCode : null;
  let errorMessage = 'Unclassified delivery failure; inspect provider configuration.';
  if (/only send testing emails|testing.*own email|resend\.dev/i.test(message)) errorMessage = 'Resend test sender restriction; use a verified domain.';
  else if (/domain.*not verified|verify.*domain/i.test(message)) errorMessage = 'Sender domain is not verified in Resend.';
  else if (/not authorized.*send|restricted.*domain/i.test(message)) errorMessage = 'API key does not permit this sender domain.';
  else if (/api.?key/i.test(message) || /api_key|invalid_access/.test(errorName)) errorMessage = 'API key authentication or permission failure.';
  else if (/from.*field|sender.*invalid|invalid.*sender/i.test(message)) errorMessage = 'Invalid EMAIL_FROM format.';
  else if (/unable to fetch|fetch failed|request could not be resolved/i.test(message)) errorMessage = 'Transport failure; no provider acceptance confirmed.';
  else if (/timeout|abort/i.test(errorName)) errorMessage = 'Email request timed out or was aborted.';
  else if (statusCode === 429 || /quota|rate_limit/.test(errorName)) errorMessage = 'Provider rate limit or quota exceeded.';
  else if (statusCode && statusCode >= 500) errorMessage = 'Provider server failure.';
  return { errorName, errorMessage, statusCode };
}
