// Fail the production build on incomplete security configuration; no secret values logged.
if (process.env.VERCEL_ENV === 'production') {
  for (const key of ['APP_ORIGIN','DATABASE_URL','DIRECT_URL','SESSION_SECRET','RESEND_API_KEY','EMAIL_FROM','RESEND_WEBHOOK_SECRET']) {
    if (!process.env[key]) throw new Error('Missing production configuration: '+key);
  }
  const origin = new URL(process.env.APP_ORIGIN);
  if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw new Error('APP_ORIGIN must be an HTTPS origin.');
  if(process.env.SESSION_SECRET.length<32)throw new Error('SESSION_SECRET must have at least 32 random characters.');
  if(!/^whsec_[A-Za-z0-9+/=]+$/.test(process.env.RESEND_WEBHOOK_SECRET))throw new Error('Invalid RESEND_WEBHOOK_SECRET format.');
  if(/[\r\n]/.test(process.env.EMAIL_FROM)||!process.env.EMAIL_FROM.includes('@'))throw new Error('EMAIL_FROM must be a verified sender address.');
  for(const key of ['DATABASE_URL','DIRECT_URL']){
    const url=new URL(process.env[key]);
    if(!['postgres:','postgresql:'].includes(url.protocol)||['127.0.0.1','localhost'].includes(url.hostname)||!['require','verify-ca','verify-full'].includes(url.searchParams.get('sslmode')))throw new Error('Production database must require TLS: '+key);
  }
  if(process.env.EMAIL_TEST_ENDPOINT||process.env.SECURITY_TEST_MODE)throw new Error('Test configuration is forbidden in production.');
}
