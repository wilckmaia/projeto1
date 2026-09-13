import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
// Uses the existing isolated Chromium/CDP harness and real local API.
export async function testAuthBrowser({ evaluate, waitFor, navigate, prisma, mail, screenshot }) {
  const email = randomUUID() + '@example.test';
  const password = 'Browser verification password ' + randomUUID();
  const fill = async (label, value) => {
    await evaluate(`(() => { const input = document.querySelector('input[aria-label="' + ${JSON.stringify(label)} + '"]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)});
      input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  };
  const submit = () => evaluate("document.querySelector('form').requestSubmit()");
  let user;
  try {
    await prisma.rateLimit.deleteMany();
    await navigate('/');
    await waitFor("!!document.querySelector('.auth-tabs')");
    await evaluate("document.querySelectorAll('.auth-tabs button')[1].click()");
    await fill('Seu nome', 'Browser owner'); await fill('Seu e-mail', email); await fill('Sua senha', password);
    await submit(); await waitFor("!!document.querySelector('[role=status]')");
    user = await prisma.user.findUniqueOrThrow({ where: { email } });
    assert.equal(user.emailVerifiedAt, null);
    assert.equal(mail.filter(item => item.to.includes(email)).length, 0, 'registration without mail');
    assert.equal(await evaluate(`!!document.querySelector('a[href="/verificar-email"]')`), false);
    await screenshot('auth-register-ready');
    await navigate('/'); await waitFor("!!document.querySelector('form')");
    await fill('Seu e-mail', email); await fill('Sua senha', password); await submit();
    await waitFor("!!document.querySelector('.world-grid')");
    await evaluate("[...document.querySelectorAll('button')].find(b => b.textContent === 'Sair').click()");
    await waitFor("!!document.querySelector('.auth-form')");
    assert.equal(await evaluate(`!!document.querySelector('a[href="/recuperar-senha"]')`), false);
    await navigate('/confirmar#kind=reset&token=' + 'a'.repeat(43));
    await waitFor("!!document.querySelector('[role=alert]')");
    assert.equal(await evaluate("!!document.querySelector('input[type=password]')"), false);
    await navigate('/'); await waitFor("!!document.querySelector('form')");
    await fill('Seu e-mail', email); await fill('Sua senha', password); await submit();
    await waitFor("!!document.querySelector('.world-grid')");
    await evaluate("[...document.querySelectorAll('button')].find(b => b.textContent === 'Sair').click()");
    await waitFor("!!document.querySelector('.auth-form')");
    console.log('PASS: Chromium signup, login, logout and removed recovery UI.');
  } finally {
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
    await prisma.authChallenge.deleteMany({ where: { email } });
    await prisma.rateLimit.deleteMany();
  }
}
