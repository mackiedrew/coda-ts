import { Coda } from '../../main';
import { ResourceType } from '../../types/resource';

let coda: Coda;
let invalidCoda: Coda;

beforeEach(() => {
  coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');
  invalidCoda = new Coda('fake token!');
});

describe('Account API returns expected results for', () => {
  describe('GET /whoAmI', () => {
    test('with valid token', async () => {
      const whoAmI = await coda.Account.whoAmI();
      expect(whoAmI.type).toBe(ResourceType.User);
      expect(whoAmI.scoped).toBe(false);
      expect(whoAmI.href).toBe('https://coda.io/apis/v1/whoami');
    });
    test('with invalid token', async () => {
      await invalidCoda.Account.whoAmI().catch((error) => {
        expect(error.response.data.statusCode).toBe(401);
        expect(error.response.data.statusMessage).toBe('Unauthorized');
      });
    });
  });
});
