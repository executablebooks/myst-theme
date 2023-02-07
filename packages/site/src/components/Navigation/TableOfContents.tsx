import React from 'react';
import classNames from 'classnames';
import { NavLink, useParams, useLocation } from '@remix-run/react';
import type { SiteManifest } from 'myst-config';
import { useNavOpen, useSiteManifest, useUrlbase, withUrlbase } from '@myst-theme/providers';
import { getProjectHeadings } from '../../loaders';
import type { Heading } from '../../types';

type Props = {
  folder?: string;
  headings: Heading[];
  sections?: ManifestProject[];
};

type ManifestProject = Required<SiteManifest>['projects'][0];

const HeadingLink = ({
  path,
  isIndex,
  title,
  children,
}: {
  path: string;
  isIndex?: boolean;
  title?: string;
  children: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  const exact = pathname === path;
  const urlbase = useUrlbase();
  const [, setOpen] = useNavOpen();
  return (
    <NavLink
      prefetch="intent"
      title={title}
      className={({ isActive }: { isActive: boolean }) =>
        classNames('block break-words', {
          'text-blue-600 dark:text-white': !isIndex && isActive,
          'font-semibold': isActive,
          'hover:text-slate-800 dark:hover:text-slate-100': !isActive,
          'border-b pb-1': isIndex,
          'border-stone-200 dark:border-stone-700': isIndex && !exact,
          'border-blue-500': isIndex && exact,
        })
      }
      to={withUrlbase(path, urlbase)}
      suppressHydrationWarning // The pathname is not defined on the server always.
      onClick={() => {
        // Close the nav panel if it is open
        setOpen(false);
      }}
    >
      {children}
    </NavLink>
  );
};

const HEADING_CLASSES = 'text-slate-900 text-lg leading-6 dark:text-slate-100';
const Headings = ({ folder, headings, sections }: Props) => {
  const secs = sections || [];
  return (
    <ul className="text-slate-500 dark:text-slate-300 leading-6">
      {secs.map((sec) => {
        if (sec.slug === folder) {
          return headings.map((heading, index) => (
            <li
              key={heading.slug || index}
              className={classNames('p-1', {
                [HEADING_CLASSES]: heading.level === 'index',
                'font-semibold': heading.level === 'index',
                'pl-4': heading.level === 2,
                'pl-6': heading.level === 3,
                'pl-8': heading.level === 4,
                'pl-10': heading.level === 5,
                'pl-12': heading.level === 6,
              })}
            >
              {heading.path ? (
                <HeadingLink
                  title={heading.title}
                  path={heading.path}
                  isIndex={heading.level === 'index'}
                >
                  {heading.short_title || heading.title}
                </HeadingLink>
              ) : (
                <h5 className="text-slate-900 font-semibold my-2 text-md leading-6 dark:text-slate-100 break-words">
                  {heading.short_title || heading.title}
                </h5>
              )}
            </li>
          ));
        }
        return (
          <li key={sec.slug} className={classNames('p-1 my-2 lg:hidden', HEADING_CLASSES)}>
            <HeadingLink path={`/${sec.slug}`}>{sec.short_title || sec.title}</HeadingLink>
          </li>
        );
      })}
    </ul>
  );
};

const TOC_CLASS =
  'flex-col fixed z-30 bottom-0 left-[max(0px,calc(50%-45rem))] w-[19.5rem] border-r border-stone-200 dark:border-stone-700';

export const TableOfContents = ({
  projectSlug,
  top,
  height,
  footer,
}: {
  top?: number;
  height?: number;
  projectSlug?: string;
  footer?: React.ReactNode;
}) => {
  const [open] = useNavOpen();
  const config = useSiteManifest();
  const { folder, project } = useParams();
  const resolvedProjectSlug = projectSlug || (folder ?? project);
  if (!config) return null;
  const headings = getProjectHeadings(config, resolvedProjectSlug, {
    addGroups: false,
  });
  if (!headings) return null;
  return (
    <div
      className={classNames(TOC_CLASS, 'overflow-hidden', {
        flex: open,
        'bg-white dark:bg-stone-900': open, // just apply when open, so that theme can transition
        'hidden xl:flex': !open,
      })}
      style={{
        top: top ?? 0,
        height:
          typeof document === 'undefined' || (height && height > window.innerHeight - (top ?? 0))
            ? undefined
            : height,
      }}
      suppressHydrationWarning
    >
      <nav
        aria-label="Table of Contents"
        className="flex-grow pt-10 pb-3 px-8 overflow-y-auto transition-opacity"
        style={{ opacity: height && height > 150 ? undefined : 0 }}
      >
        <Headings folder={resolvedProjectSlug} headings={headings} sections={config?.projects} />
      </nav>
      {footer && <div className="flex-none py-4">{footer}</div>}
    </div>
  );
};
