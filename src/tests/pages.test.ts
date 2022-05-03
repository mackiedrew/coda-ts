import { Coda } from '../main';
import { Doc } from '../resources/doc';

let doc: Doc;

beforeAll(async () => {
  const token = process.env.CODA_UNRESTRICTED_API_KEY || '';
  const docId = process.env.LIVE_DOC_ID || '';
  doc = await new Coda(token).Docs.get(docId);
});

describe('Pages', () => {
  const testPageId = process.env.INTACT_PAGE_ID || '';

  test('list()', async () => {
    const pages = await doc.Pages.list();
    const pageIds = pages.items.map((page) => page.id);
    expect(pageIds).toContain(testPageId);
  });

  test('get()', async () => {
    const page = await doc.Pages.get(testPageId);
    expect(page?.id).toBe(testPageId);
  });
});
