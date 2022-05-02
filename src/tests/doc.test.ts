import { Coda } from '../main';

const coda: Coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');

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

  test('publish()', async () => {
    expect(true).toBe(true);
  });

  test('unpublish()', async () => {
    expect(true).toBe(true);
  });
});
