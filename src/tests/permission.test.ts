import { Coda } from '../main';
import { Doc } from '../resources/doc';
import { AccessType, PrincipalEmail, PrincipalType } from '../resources/permissions';

let doc: Doc;

beforeAll(async () => {
  const token = process.env.CODA_UNRESTRICTED_API_KEY || '';
  const docId = 'uq0jEWnseE';
  doc = await new Coda(token).Docs.get(docId);
});

// Overly built test due to the limitations of permissions api
describe('Permission', () => {
  jest.setTimeout(120_000);
  test('Permission, add, list remove', async () => {
    const testEmail = 'mackiedrew+coda-ts-test@gmail.com';

    // Clean up any old permissions
    const initialList = await doc.Permissions.list();
    await Promise.all(
      initialList.items.map(async (permission) => await doc.Permissions.delete(permission.id)),
    );

    await doc.Permissions.add({
      access: AccessType.Write,
      principal: { email: testEmail, type: PrincipalType.Email },
    });

    const addedList = await doc.Permissions.list();
    const addedPermissionPrincipal = addedList.items[0].principal as PrincipalEmail;

    expect(addedPermissionPrincipal.email).toBe(testEmail);

    await doc.Permissions.delete(addedList.items[0].id);
    const deletedList = await doc.Permissions.list();

    expect(deletedList.items.length).toBe(0);
  });
});
