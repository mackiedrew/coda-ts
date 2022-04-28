import { Coda } from '../../main';

const coda: Coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');

beforeEach(async () => {
  await new Promise((res) => setTimeout(res, 1000));
});

describe('Doc API returns expected results for', () => {
  test('list docs', async () => {
    const docList = await coda.Docs.list();
    expect(docList.items).toBeInstanceOf(Array);
    expect(docList.href).toContain('https://coda.io/apis/v1/docs');
  });

  test('create doc', async () => {
    const doc = await coda.Docs.create({ title: 'Create Doc Test' });
    doc.delete();
    expect(doc.id).toBeTruthy();
  });

  test('get doc', async () => {
    const doc = await coda.Docs.create({ title: 'Get Doc Test' });
    const doubleCheckedDoc = await coda.Docs.get(doc.id);
    expect(doubleCheckedDoc.id).toBe(doc.id);
    doc.delete();
  });

  test('get categories', async () => {
    const categories = await coda.Docs.catetories();
    expect(categories.length).toBeGreaterThanOrEqual(0);
  });
});
