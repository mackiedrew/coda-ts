import { Coda } from '../src/main';

const coda: Coda = new Coda(process.env.CODA_KEY || '');

describe('Docs', () => {
  test('list()', async () => {
    const docList = await coda.Docs.list();
    expect(docList.items).toBeInstanceOf(Array);
    expect(docList.href).toContain('https://coda.io/apis/v1/docs');
  });

  // test('count()', async () => {
  //   const count = await coda.Docs.count();
  //   expect(count).toBeInstanceOf(Number);
  // });

  test('create()', async () => {
    const doc = await coda.Docs.create({ title: 'Create Doc Test' });
    doc.delete();
    expect(doc.id).toBeTruthy();
  });

  test('get()', async () => {
    const doc = await coda.Docs.create({ title: 'Get Doc Test' });
    const doubleCheckedDoc = await coda.Docs.get(doc.id);
    expect(doubleCheckedDoc.id).toBe(doc.id);
    doc.delete();
  });

  test('categories()', async () => {
    const categories = await coda.Docs.catetories();
    expect(categories.length).toBeGreaterThanOrEqual(0);
  });

  describe('idFromUrl()', () => {
    test('can get ID from valid URL', async () => {
      const testUrl = 'https://coda.io/d/_duq0jEWnseE/Automations_suPXH#_luXb5';
      expect(coda.Docs.idFromUrl(testUrl)).toBe('uq0jEWnseE');
    });

    test('handles invalid URL', async () => {
      const testUrl = 'https://coda.io/workspaces/ws-cpFpNRJjbt/docs';
      expect(coda.Docs.idFromUrl(testUrl)).toBeUndefined();
    });
  });
});
