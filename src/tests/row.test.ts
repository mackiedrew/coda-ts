import { randomInt } from 'node:crypto';
import { Coda } from '../main';
import { Rows } from '../resources/rows';

let rows: Rows;

beforeAll(async () => {
  const token = process.env.CODA_KEY || '';
  const docId = 'uq0jEWnseE';
  const tableId = 'grid-8A4rQsaQom';

  const doc = await new Coda(token).Docs.get(docId);
  const table = await doc.Tables.get(tableId);
  rows = table.Rows;
});

describe('Row', () => {
  jest.setTimeout(120_000);
  const testRowId = 'i-OEjqhSsosE';

  test('get()', async () => {
    const row = await rows.get(testRowId);
    expect(row.id).toBe(testRowId);
  });

  test('delete()', async () => {
    const rowName = 'Kill This Row';
    const rowCheck = randomInt(100);

    const data = {
      rows: [
        {
          cells: [
            { column: 'Name', value: rowName },
            { column: 'Check', value: rowCheck },
          ],
        },
      ],
    };
    const upsertResult = await rows.upsert(data);
    await upsertResult.mutation.wait();
    const addedRowId = upsertResult.addedRowIds[0];
    const row = await rows.get(addedRowId, true);
    const deleteResult = await row.delete();
    const successful = await deleteResult.mutation.wait(20_000, 6);
    expect(successful).toBe(true);
    expect(deleteResult.rowId).toBe(addedRowId);
  });

  test('update() row + refresh()', async () => {
    const row = await rows.get(testRowId, true);

    const oldUpdatedAt = row.updatedAt;
    const nextCheck = randomInt(100);

    const update = await row.update({ cells: [{ column: 'Check', value: nextCheck }] });
    await update.mutation.wait();

    await row.refresh(true);

    expect(row.values?.['Check']).toBe(nextCheck);
    expect(row.updatedAt).not.toBe(oldUpdatedAt);
  });

  test('pushButton()', async () => {
    const row = await rows.get(testRowId, true);
    const check = row.values?.['Check'] as number;
    const result = await row.pushButton('Buttons');
    await result.mutation.wait();
    await row.refresh(true);
    const nextCheck = row.values?.['Check'] as number;

    expect(nextCheck).toBe(check + 1);
  });
});
