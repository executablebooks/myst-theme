import { SourceFileKind, type GenericNode } from 'myst-common';
import { KnownCellOutputMimeTypes } from 'nbtx';
import type { MinifiedMimeOutput, MinifiedOutput } from 'nbtx';
import classNames from 'classnames';
import { SafeOutputs } from './safe';
import { JupyterOutputs } from './jupyter';
import { useMemo } from 'react';
import { useCellExecution, useIsAComputableCell, useReadyToExecute } from './execute';

export const DIRECT_OUTPUT_TYPES = new Set(['stream', 'error']);

export const DIRECT_MIME_TYPES = new Set([
  KnownCellOutputMimeTypes.TextPlain,
  KnownCellOutputMimeTypes.ImagePng,
  KnownCellOutputMimeTypes.ImageGif,
  KnownCellOutputMimeTypes.ImageJpeg,
  KnownCellOutputMimeTypes.ImageBmp,
]) as Set<string>;

export function allOutputsAreSafe(
  outputs: MinifiedOutput[],
  directOutputTypes: Set<string>,
  directMimeTypes: Set<string>,
) {
  return outputs.reduce((flag, output) => {
    if (directOutputTypes.has(output.output_type)) return flag && true;
    const data = (output as MinifiedMimeOutput).data;
    const mimetypes = data ? Object.keys(data) : [];
    const safe =
      'data' in output &&
      Boolean(output.data) &&
      mimetypes.every((mimetype) => directMimeTypes.has(mimetype));
    return flag && safe;
  }, true);
}

function JupyterOutput({
  nodeKey,
  nodeType,
  identifier,
  data,
  align,
}: {
  nodeKey: string;
  identifier?: string;
  data: MinifiedOutput[];
  nodeType?: string;
  align?: 'left' | 'center' | 'right';
}) {
  const { kind, ready } = useCellExecution(nodeKey);
  const outputs: MinifiedOutput[] = data;
  const allSafe = useMemo(
    () => allOutputsAreSafe(outputs, DIRECT_OUTPUT_TYPES, DIRECT_MIME_TYPES),
    [outputs],
  );

  let component;
  if (allSafe && !ready) {
    component = <SafeOutputs keyStub={nodeKey} outputs={outputs} />;
  } else {
    component = <JupyterOutputs id={nodeKey} outputs={outputs} />;
  }

  const showControls = kind === SourceFileKind.Article;

  return (
    <figure
      id={identifier || undefined}
      data-mdast-node-type={nodeType}
      data-mdast-node-id={nodeKey}
      className={classNames('max-w-full overflow-visible m-0 group not-prose relative', {
        'text-left': !align || align === 'left',
        'text-center': align === 'center',
        'text-right': align === 'right',
      })}
    >
      {showControls && (
        <div className="sticky top-[60px]">
          <div className="absolute -top-[28px] md:top-[30px] right-0 md:-right-[28px]">[O]</div>
        </div>
      )}
      {component}
    </figure>
  );
}

export function Output(node: GenericNode) {
  // Note, NodeRenderer's can't have hooks in it directly!
  return (
    <JupyterOutput
      key={node.key}
      nodeKey={node.key}
      nodeType={node.type}
      identifier={node.identifier}
      align={node.align}
      data={node.data}
    />
  );
}
