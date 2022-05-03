import { randomInt } from 'node:crypto';
import { Coda } from '../main';
import { Rows } from '../resources/rows';

let rows: Rows;

beforeAll(async () => {
  const token = process.env.CODA_UNRESTRICTED_API_KEY || '';
  const docId = process.env.LIVE_DOC_ID || '';
  const tableId = process.env.ROWS_TABLE_ID || '';

  const doc = await new Coda(token).Docs.get(docId);
  const table = await doc.Tables.get(tableId);
  rows = table.Rows;
});

describe('Row', () => {
  jest.setTimeout(120_000);
  const testRowId = process.env.ROW_ID || '';

  test('get()', async () => {
    const row = await rows.get(testRowId);
    expect(row.id).toBe(testRowId);
  });

  // test('delete()', async () => {
  //   const rowName = 'Kill This Row';
  //   const rowCheck = randomInt(100);

  //   const data = {
  //     rows: [
  //       {
  //         cells: [
  //           { column: 'Name', value: rowName },
  //           { column: 'Check', value: rowCheck },
  //         ],
  //       },
  //     ],
  //   };
  //   const upsertResult = await rows.upsert(data);
  //   await upsertResult.mutation.wait();
  //   const addedRowId = upsertResult.addedRowIds[0];
  //   const row = await rows.get(addedRowId, true);
  //   const deleteResult = await row.delete();
  //   const successful = await deleteResult.mutation.wait(20_000, 6);
  //   expect(successful).toBe(true);
  //   expect(deleteResult.rowId).toBe(addedRowId);
  // });

  test('update() + refresh()', async () => {
    const row = await rows.get(testRowId, true);

    const oldUpdatedAt = row.updatedAt;
    const nextCheck = randomInt(100);

    const update = await row.update({ cells: [{ column: 'Check', value: nextCheck }] });
    await update.mutation.wait();

    await row.refresh(true);

    expect(row.values?.['Check']).toBe(nextCheck);
    expect(row.updatedAt).not.toBe(oldUpdatedAt);
  });
  // test('pushButton()', async () => {});
});
