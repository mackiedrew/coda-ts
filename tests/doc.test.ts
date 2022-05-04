import { randomUUID } from 'node:crypto';
import { Coda, PublishMode } from '../src/main';

const coda: Coda = new Coda(process.env.CODA_KEY || '');

describe('Doc', () => {
  test('getShareMetadata()', async () => {
    const doc = await coda.Docs.create({ title: 'Share Metadata Doc Test' });
    const shareMetadata = await doc.getShareMetadata();
    doc.delete();
    expect(shareMetadata.canCopy).toBe(true);
    expect(shareMetadata.canShare).toBe(true);
    expect(shareMetadata.canShareWithOrg).toBe(false);
  });

  test('delete()', async () => {
    const doc = await coda.Docs.create({ title: 'Delete Doc Test' });
    expect(await doc.delete()).toBe(true);
    await coda.Docs.get(doc.id).catch((error) => {
      expect(error.response.data.statusCode).toBe(404);
      expect(error.response.data.statusMessage).toBe('Not Found');
    });
  });

  describe('publishing', () => {
    jest.setTimeout(60_000);
    const docId = 'uq0jEWnseE';
    const docs = coda.Docs;

    test('publish()', async () => {
      const doc = await docs.get(docId);
      const mutation = await doc.publish({
        slug: `coda-ts-test-${randomUUID()}`,
        discoverable: false,
        earnCredit: false,
        categoryNames: [],
        mode: PublishMode.Edit,
      });
      await mutation.wait();
      await doc.get();
      expect(doc.published).toBeTruthy();
    });

    test('unpublish()', async () => {
      const doc = await docs.get(docId);
      await doc.unpublish();
      await new Promise((resolve) => setTimeout(resolve, 30_000));
      await doc.get();
      expect(doc.published).toBeFalsy();
    });
  });
});
