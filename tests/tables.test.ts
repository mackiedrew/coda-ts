import { Coda, Doc, TableType } from '../src/main';

let doc: Doc;

beforeAll(async () => {
  const token = process.env.CODA_KEY || '';
  const docId = 'uq0jEWnseE';
  doc = await new Coda(token).Docs.get(docId);
});

describe('Tables', () => {
  const testTableId = 'grid-8A4rQsaQom';

  test('list()', async () => {
    const tables = await doc.Tables.list();
    const tableIds = tables.items.map((table) => table.id);
    expect(tableIds).toContain(testTableId);
  });

  test('get()', async () => {
    const table = await doc.Tables.get(testTableId);
    expect(table.id).toBe(testTableId);
    expect(table.tableType).toBe(TableType.Table);
  });
});
