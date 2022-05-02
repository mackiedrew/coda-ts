import { Coda } from '../main';
import { ResourceType } from '../types/resource';

const coda: Coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');

const docId = process.env.LIVE_DOC_ID || '';

const intactPageUrl = process.env.INTACT_PAGE_URL || '';
const intactPageId = process.env.INTACT_PAGE_ID || '';
const deletedPageUrl = process.env.DELETED_PAGE_URL || '';

describe('/resolveBrowserLink returns expected results for', () => {
  test('a page when intact', async () => {
    const link = await coda.resolveBrowserLink(intactPageUrl);
    expect(link.resource.id).toBe(intactPageId);
    expect(link.resource.type).toBe(ResourceType.Page);
  });

  test('a doc when a page was deleted and degradation is graceful', async () => {
    const link = await coda.resolveBrowserLink(deletedPageUrl, true);
    expect(link.resource.id).toBe(docId);
    expect(link.resource.type).toBe(ResourceType.Doc);
  });

  test('an error when a page was deleted and degradation not graceful', async () => {
    await coda.resolveBrowserLink(deletedPageUrl).catch((error) => {
      expect(error.response.data.statusCode).toBe(404);
    });
  });
});
