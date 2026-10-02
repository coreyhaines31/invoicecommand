import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import type { Screen } from 'e2e';

// Dates are only set client-side, so a filled date means React has hydrated and input won't be dropped.
// A cold `next dev` compiles on first request, so allow well past the default 5s.
async function waitForHydration(screen: Screen) {
  await expect(screen.getByLabel('Invoice Date')).not.toHaveValue('', { timeout: 30_000 });
}

test('a visitor builds an invoice and it survives a reload', async ({ app, agent, screen, browser }) => {
  await app.open('/');
  await waitForHydration(screen);

  await agent.act('fill in Business Name {business} and Client Name {client}', {
    params: { business: 'Acme Design Co', client: 'Globex Corp' },
  });
  await expect(screen.getByLabel('Business Name')).toHaveValue('Acme Design Co');
  await expect(screen.getByLabel('Client Name')).toHaveValue('Globex Corp');

  await agent.act('set the first line item to {description}, quantity {quantity}, rate {rate}', {
    params: { description: 'Logo design', quantity: '3', rate: '150' },
  });
  await expect(screen.getByLabel('Description').first()).toHaveValue('Logo design');

  await agent.act('set the Tax Rate to {tax} percent', { params: { tax: '10' } });
  await expect(screen.getByLabel('Tax Rate (%)')).toHaveValue('10');

  await agent.assert('the invoice preview shows a subtotal of $450.00 and a total of $495.00');
  await expect(screen.getByText('$495.00').first()).toBeVisible();

  await browser.reload();
  await waitForHydration(screen);
  await expect(screen.getByLabel('Client Name')).toHaveValue('Globex Corp');
  await expect(screen.getByLabel('Description').first()).toHaveValue('Logo design');
});
