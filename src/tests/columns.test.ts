import { Coda } from '../main';
import { Columns } from '../resources/columns';

let columns: Columns;

beforeAll(async () => {
  const token = process.env.CODA_UNRESTRICTED_API_KEY || '';
  const docId = process.env.LIVE_DOC_ID || '';
  const tableId = process.env.ROWS_TABLE_ID || '';

  const doc = await new Coda(token).Docs.get(docId);
  const table = await doc.Tables.get(tableId);

  columns = table.Columns;
});

describe('Columns', () => {
  const testColumnId = process.env.TEST_COLUMN_ID || '';
  test('list()', async () => {
    const columnsList = await columns.list();
    expect(columnsList.items[0].id).toBe(testColumnId);
  });

  test('get()', async () => {
    const column = await columns.get(testColumnId);
    expect(column.id).toBe(testColumnId);
  });
});
