import type { GenericParent } from 'myst-common';
import type { NodeRenderer } from '@myst-theme/providers';
import { useReferences } from '@myst-theme/providers';
import { useParse } from '.';
import { ClickPopover } from './components/ClickPopover';

export function FootnoteDefinition({ identifier }: { identifier: string }) {
  const references = useReferences();
  const node = references?.footnotes?.[identifier];
  const children = useParse(node as GenericParent);
  return <>{children}</>;
}

export const FootnoteReference: NodeRenderer = (node) => {
  return (
    <ClickPopover
      key={node.key}
      card={<FootnoteDefinition identifier={node.identifier as string} />}
      as="span"
    >
      <sup>[{node.number ?? node.identifier}]</sup>
    </ClickPopover>
  );
};

const FOOTNOTE_RENDERERS = {
  footnoteReference: FootnoteReference,
};

export default FOOTNOTE_RENDERERS;
