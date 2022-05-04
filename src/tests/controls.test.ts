import { Coda } from '../main';

const coda: Coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');
const docId = 'uq0jEWnseE';

describe('Controls', () => {
  const controlId = 'ctrl-y79hKSzABI';
  test('list()', async () => {
    const doc = await coda.Docs.get(docId);
    const controls = await doc.Controls.list();
    expect(controls.items[0].parent.href).toBeTruthy();
  });

  test('get()', async () => {
    const doc = await coda.Docs.get(docId);
    const control = await doc.Controls.get(controlId);
    expect(control.id).toBeTruthy();
    expect(control.value).toBeTruthy();
  });
});
