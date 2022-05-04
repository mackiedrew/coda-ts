import { Coda } from '../main';
import { Columns } from '../resources/columns';

let columns: Columns;

beforeAll(async () => {
  const token = process.env.CODA_UNRESTRICTED_API_KEY || '';
  const docId = 'uq0jEWnseE';
  const tableId = 'grid-8A4rQsaQom';

  const doc = await new Coda(token).Docs.get(docId);
  const table = await doc.Tables.get(tableId);

  columns = table.Columns;
});

describe('Columns', () => {
  const testColumnId = 'c-3-zbNePtA-';
  test('list()', async () => {
    const columnsList = await columns.list();
    expect(columnsList.items[0].id).toBe(testColumnId);
  });

  test('get()', async () => {
    const column = await columns.get(testColumnId);
    expect(column.id).toBe(testColumnId);
  });
});
