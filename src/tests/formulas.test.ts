import { Coda } from '../main';

const coda: Coda = new Coda(process.env.CODA_UNRESTRICTED_API_KEY || '');
const docId = process.env.LIVE_DOC_ID || '';
const formulaId = process.env.FORMULA_ID || '';

describe('Formulas', () => {
  test('list()', async () => {
    const doc = await coda.Docs.get(docId);
    const formulas = await doc.Formulas.list();
    expect(formulas.items[0].parent.href).toBeTruthy();
  });

  test('get()', async () => {
    const doc = await coda.Docs.get(docId);
    const formula = await doc.Formulas.get(formulaId);
    expect(formula.id).toBeTruthy();
    expect(formula.value).toBeTruthy();
  });
});
