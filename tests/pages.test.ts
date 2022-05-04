import { Coda, Doc } from '../src/main';

let doc: Doc;

beforeAll(async () => {
  const token = process.env.CODA_KEY || '';
  const docId = 'uq0jEWnseE';
  doc = await new Coda(token).Docs.get(docId);
});

describe('Pages', () => {
  const testPageId = 'canvas-r4UCASEB-O';

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
