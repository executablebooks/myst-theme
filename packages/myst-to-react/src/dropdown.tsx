import React from 'react';
import type { NodeRenderer } from '@myst-theme/providers';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import classNames from 'classnames';

type DropdownSpec = {
  type: 'details';
  open?: boolean;
};
type SummarySpec = {
  type: 'summary';
};

const iconClass = 'h-8 w-8 inline-block pl-2 mr-2 -translate-y-[1px]';

export const SummaryTitle: NodeRenderer<SummarySpec> = (node, children) => {
  return children;
};

export function Details({
  title,
  children,
  open,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details
      className={classNames(
        'rounded-md my-5 shadow dark:shadow-2xl dark:shadow-neutral-900 overflow-hidden',
        'bg-gray-50 dark:bg-stone-800',
      )}
      open={open}
    >
      <summary
        className={classNames(
          'm-0 text-lg font-medium py-1 min-h-[2em] pl-3',
          'cursor-pointer hover:shadow-[inset_0_0_0px_30px_#00000003] dark:hover:shadow-[inset_0_0_0px_30px_#FFFFFF03]',
          'bg-gray-100 dark:bg-slate-900',
        )}
      >
        <span className="text-neutral-900 dark:text-white">
          <span className="block float-right text-sm font-thin text-neutral-700 dark:text-neutral-200">
            <ChevronRightIcon
              className={classNames(iconClass, 'details-toggle', 'transition-transform')}
            />
          </span>
          {title}
        </span>
      </summary>
      <div className="px-4 py-1 details-body">{children}</div>
    </details>
  );
}

export const DetailsRenderer: NodeRenderer<DropdownSpec> = (node, children) => {
  const [title, ...rest] = children as any[];
  return (
    <Details key={node.key} title={title} open={node.open}>
      {rest}
    </Details>
  );
};

const DROPDOWN_RENDERERS = {
  details: DetailsRenderer,
  summary: SummaryTitle,
};

export default DROPDOWN_RENDERERS;
