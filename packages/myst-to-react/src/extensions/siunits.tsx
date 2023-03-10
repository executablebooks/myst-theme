import type { NodeRenderer } from '@myst-theme/providers';

export const SIUnits: NodeRenderer = (node) => {
  return (
    <code key={node.key} className="text-inherit" title={`${node.num} ${node.units}`}>
      {node.value}
    </code>
  );
};

const SI_RENDERERS = {
  si: SIUnits,
};

export default SI_RENDERERS;
