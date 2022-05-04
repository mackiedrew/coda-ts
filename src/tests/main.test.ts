import { Coda } from '../main';
import { ResourceType } from '../resources/base';

describe('Coda', () => {
  describe('whoAmI()', () => {
    test('returns expected result with valid token', async () => {
      const coda = new Coda(process.env.CODA_KEY || '');
      const whoAmI = await coda.whoAmI();
      expect(whoAmI.type).toBe(ResourceType.User);
      expect(whoAmI.scoped).toBe(false);
      expect(whoAmI.href).toBe('https://coda.io/apis/v1/whoami');
    });

    test('returns expected error with invalid token', async () => {
      const invalidCoda = new Coda('fake token!');
      await invalidCoda.whoAmI().catch((error) => {
        expect(error.response.data.statusCode).toBe(401);
        expect(error.response.data.statusMessage).toBe('Unauthorized');
      });
    });
  });

  describe('resolveBrowserLink()', () => {
    const coda: Coda = new Coda(process.env.CODA_KEY || '');

    const docId = 'uq0jEWnseE';
    const intactPageUrl = 'https://coda.io/d/Test-Document_duq0jEWnseE/Test-123_suHU9#_lumwu';
    const intactPageId = 'canvas-r4UCASEB-O';
    const deletedPageUrl = 'https://coda.io/d/Test-Document_duq0jEWnseE/Deleted-Page_sufXo#_lukoS';

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
});
