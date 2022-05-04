import { randomInt } from 'node:crypto';
import { Coda, Page } from '../src/main';

let page: Page;
const testPageId = 'canvas-r4UCASEB-O';

beforeAll(async () => {
  const token = process.env.CODA_KEY || '';
  const docId = 'uq0jEWnseE';
  const doc = await new Coda(token).Docs.get(docId);
  page = await doc.Pages.get(testPageId);
});

describe('Page', () => {
  jest.setTimeout(120_000);
  test('get()', async () => {
    const samePage = await page.get();
    expect(samePage.id).toBe(page.id);
  });

  test('update()', async () => {
    const subtitle = randomInt(100).toString();
    const mutation = await page.update({ subtitle });
    await mutation.wait();
    await page.get();
    expect(page.subtitle).toBe(subtitle);
  });
});
