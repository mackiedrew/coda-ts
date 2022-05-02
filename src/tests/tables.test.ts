import { Coda } from '../main';
import { Doc } from '../resources/doc';
import { TableType } from '../resources/table';

let doc: Doc;

beforeAll(async () => {
  const token = process.env.CODA_UNRESTRICTED_API_KEY || '';
  const docId = process.env.LIVE_DOC_ID || '';
  doc = await new Coda(token).Docs.get(docId);
});

describe('Tables', () => {
  const testTableId = process.env.ROWS_TABLE_ID || '';

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
