import type { Admonition as AdmonitionSpec } from 'myst-spec';
import React from 'react';
import type { NodeRenderer } from '@myst-theme/providers';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import classNames from 'classnames';
import { HashLink } from './heading';

export enum ProofKind {
  proof = 'proof',
  axiom = 'axiom',
  lemma = 'lemma',
  definition = 'definition',
  criterion = 'criterion',
  remark = 'remark',
  conjecture = 'conjecture',
  corollary = 'corollary',
  algorithm = 'algorithm',
  example = 'example',
  property = 'property',
  observation = 'observation',
  proposition = 'proposition',
  assumption = 'assumption',
  theorem = 'theorem',
}

type Color = 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';

function getClasses(className?: string) {
  const classes =
    className
      ?.split(' ')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => !!s) ?? [];
  return [...new Set(classes)];
}

function capitalize(kind?: string) {
  if (!kind) return '';
  return kind.slice(0, 1).toUpperCase() + kind.slice(1);
}

function getColor({ kind }: { kind?: ProofKind | string; classes?: string[] }): {
  color: Color;
} {
  switch (kind) {
    case ProofKind.proof:
    case ProofKind.algorithm:
      return { color: 'gray' };
    case ProofKind.lemma:
    case ProofKind.conjecture:
    case ProofKind.theorem:
      return { color: 'purple' };
    case ProofKind.observation:
    case ProofKind.assumption:
    case ProofKind.axiom:
      return { color: 'yellow' };
    case ProofKind.criterion:
    case ProofKind.corollary:
    case ProofKind.property:
      return { color: 'orange' };
    case ProofKind.example:
      return { color: 'green' };
    case ProofKind.remark:
      return { color: 'red' };
    case ProofKind.definition:
    case ProofKind.proposition:
    default:
      return { color: 'blue' };
  }
}

const WrapperElement = ({
  id,
  dropdown,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  dropdown?: boolean;
}) => {
  if (dropdown)
    return (
      <details id={id} className={className}>
        {children}
      </details>
    );
  return (
    <aside id={id} className={className}>
      {children}
    </aside>
  );
};

const HeaderElement = ({
  dropdown,
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
  dropdown?: boolean;
}) => {
  if (dropdown) return <summary className={className}>{children}</summary>;
  return <div className={className}>{children}</div>;
};

const iconClass = 'h-8 w-8 inline-block pl-2 mr-2 self-center flex-none';

export function Proof({
  title,
  kind,
  color,
  dropdown,
  children,
  identifier,
  enumerator,
}: {
  title?: React.ReactNode;
  color?: Color;
  kind?: ProofKind;
  children: React.ReactNode;
  dropdown?: boolean;
  identifier?: string;
  enumerator?: string;
}) {
  return (
    <WrapperElement
      id={identifier}
      dropdown={dropdown}
      className={classNames('my-5 shadow', 'dark:bg-stone-800', 'overflow-hidden', {
        // 'shadow-lg': !color || color === 'gray',
        // 'border-l-2 border-blue-500': color === 'blue',
        // 'border-l-2 border-green-500': color === 'green',
        // 'border-l-2 border-amber-500': color === 'yellow',
        // 'border-l-2 border-orange-500': color === 'orange',
        // 'border-l-2 border-red-500': color === 'red',
      })}
    >
      <HeaderElement
        dropdown={dropdown}
        className={classNames(
          'm-0 font-medium py-2 flex min-w-0',
          'text-md',
          '',
          'border-y dark:border-y-0 dark:border-l-4 border-slate-400',
          {
            'bg-gray-50/80 dark:bg-slate-900 dark:border-gray-500': !color || color === 'gray',
            'bg-blue-50/80 dark:bg-slate-900 dark:border-blue-500': color === 'blue',
            'bg-green-50/80 dark:bg-slate-900 dark:border-green-500': color === 'green',
            'bg-amber-50/80 dark:bg-slate-900 dark:border-amber-500': color === 'yellow',
            'bg-orange-50/80 dark:bg-slate-900 dark:border-orange-500': color === 'orange',
            'bg-red-50/80 dark:bg-slate-900 dark:border-red-500': color === 'red',
            'bg-purple-50/80 dark:bg-slate-900 dark:border-purple-500': color === 'purple',
            'cursor-pointer hover:shadow-[inset_0_0_0px_30px_#00000003] dark:hover:shadow-[inset_0_0_0px_30px_#FFFFFF03]':
              dropdown,
          },
        )}
      >
        <div
          className={classNames(
            'text-neutral-900 dark:text-white grow self-center overflow-hidden break-words',
            'ml-4', // No icon!
          )}
        >
          <HashLink id={identifier} kind={capitalize(kind)}>
            {capitalize(kind)} {enumerator}
          </HashLink>{' '}
          {title && <>({title})</>}
        </div>
        {dropdown && (
          <div className="font-thin text-sm text-neutral-700 dark:text-neutral-200 self-center flex-none">
            <ChevronRightIcon
              className={classNames(iconClass, 'transition-transform details-toggle')}
            />
          </div>
        )}
      </HeaderElement>
      <div className={classNames('px-4', { 'details-body': dropdown })}>{children}</div>
    </WrapperElement>
  );
}

export const ProofRenderer: NodeRenderer<AdmonitionSpec> = (node, children) => {
  const [title, ...rest] = children as any[];
  const classes = getClasses(node.class);
  const { color } = getColor({ kind: node.kind, classes });
  const isDropdown = classes.includes('dropdown');

  const useTitle = node.children?.[0].type === 'admonitionTitle';

  return (
    <Proof
      key={node.key}
      identifier={node.html_id}
      title={useTitle ? title : undefined}
      kind={node.kind as ProofKind}
      enumerator={(node as any).enumerator}
      color={color}
      dropdown={isDropdown}
    >
      {!useTitle && title}
      {rest}
    </Proof>
  );
};

const PROOF_RENDERERS = {
  proof: ProofRenderer,
};

export default PROOF_RENDERERS;
