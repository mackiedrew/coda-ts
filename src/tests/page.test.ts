import { randomInt } from 'node:crypto';
import { Coda } from '../main';
import { Page } from '../resources/page';

let page: Page;
const testPageId = process.env.INTACT_PAGE_ID || '';

beforeAll(async () => {
  const token = process.env.CODA_UNRESTRICTED_API_KEY || '';
  const docId = process.env.LIVE_DOC_ID || '';
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
    await page.refresh();
    expect(page.subtitle).toBe(subtitle);
  });
});
