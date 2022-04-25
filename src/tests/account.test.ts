import Coda from '../main';
import { ResourceType } from '../resources/resource';

let coda: Coda;
let invalidCoda: Coda;

beforeEach(() => {
  coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');
  invalidCoda = new Coda('fake token!');
});

describe('account api returns expected results', () => {
  describe('for whoAmI enpoint', () => {
    test('with valid token', async () => {
      const whoAmI = await coda.Account.whoAmI();
      expect(whoAmI.type).toBe(ResourceType.User);
      expect(whoAmI.scoped).toBe(false);
      expect(whoAmI.href).toBe('https://coda.io/apis/v1/whoami');
    });
    test('with invalid token', async () => {
      invalidCoda.Account.whoAmI().catch((error) => {
        expect(error.response.data.statusCode).toBe(401);
        expect(error.response.data.statusMessage).toBe('Unauthorized');
      });
    });
  });
});
