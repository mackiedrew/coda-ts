import { randomInt } from 'node:crypto';
import { Coda, RowListQueryType, RowListQueryById, Rows, RowListQueryByName } from '../src/main';

let rows: Rows;

beforeAll(async () => {
  const token = process.env.CODA_KEY || '';
  const docId = 'uq0jEWnseE';
  const tableId = 'grid-8A4rQsaQom';

  const doc = await new Coda(token).Docs.get(docId);
  const table = await doc.Tables.get(tableId);

  rows = table.Rows;
});

describe('Rows', () => {
  describe('list()', () => {
    test('handles RowListQueryType.ID query', async () => {
      const query: RowListQueryById = {
        type: RowListQueryType.ID,
        value: 'Row 2',
        columnId: 'c-3-zbNePtA-',
      };
      const rowList = await rows.list({ query });
      expect(rowList.items[0].values[query.columnId]).toBe(query.value);
    });

    test('handles RowListQueryType.Name query', async () => {
      const query: RowListQueryByName = {
        type: RowListQueryType.Name,
        value: 'Row 2',
        columnName: 'Name',
      };
      const rowList = await rows.list({ query, useColumnNames: true });
      expect(rowList.items[0].values[query.columnName]).toBe(query.value);
    });

    test('handles query with non-string query', async () => {
      const query: RowListQueryByName = {
        type: RowListQueryType.Name,
        value: 10,
        columnName: 'Check',
      };
      const rowList = await rows.list({ query, useColumnNames: true });
      expect(rowList.items[0].values[query.columnName]).toBe(query.value);
    });

    test('handles no query', async () => {
      const rowList = await rows.list();
      expect(rowList.items.length).toBeGreaterThan(0);
    });
  });

  describe('upsert, get, delete', () => {
    jest.setTimeout(120_000);

    const rowName = 'Kill This Row';
    const rowCheck = randomInt(100);
    let addedRowId: string;

    test('upsert()', async () => {
      const data = {
        rows: [
          [
            { column: 'Name', value: rowName },
            { column: 'Check', value: rowCheck },
          ],
        ],
      };
      const result = await rows.upsert(data);
      addedRowId = result.addedRowIds[0];
      const successful = await result.mutation.wait(20_000, 6);
      expect(successful).toBe(true);
      expect(result.addedRowIds.length).toBe(1);
    });

    test('get()', async () => {
      const row = await rows.get(addedRowId, true);
      expect(row.id).toBe(addedRowId);
      expect(row?.values?.['Check']).toBe(rowCheck);
    });

    test('delete()', async () => {
      const result = await rows.delete([addedRowId]);
      const successful = await result.mutation.wait(20_000, 6);
      expect(successful).toBe(true);
      expect(result.rowIds.length).toBe(1);
      expect(result.rowIds[0]).toBe(addedRowId);
    });
  });
});
