import type { NodeRenderer } from '@myst-theme/providers';
import CHEM_RENDERERS from './chemicalFormula';
import SI_RENDERERS from './siunits';

const EXT_RENDERERS: Record<string, NodeRenderer> = {
  ...CHEM_RENDERERS,
  ...SI_RENDERERS,
};

export default EXT_RENDERERS;
