import { Coda } from '../main';
import { ResourceType } from '../types/resource';

describe('Handles /whoami API with', () => {
  test('valid token', async () => {
    const coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');
    const whoAmI = await coda.whoAmI();
    expect(whoAmI.type).toBe(ResourceType.User);
    expect(whoAmI.scoped).toBe(false);
    expect(whoAmI.href).toBe('https://coda.io/apis/v1/whoami');
  });

  test('invalid token', async () => {
    const invalidCoda = new Coda('fake token!');
    await invalidCoda.whoAmI().catch((error) => {
      expect(error.response.data.statusCode).toBe(401);
      expect(error.response.data.statusMessage).toBe('Unauthorized');
    });
  });
});
