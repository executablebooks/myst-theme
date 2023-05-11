import type { Link } from 'myst-spec';
import ExternalLinkIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import LinkIcon from '@heroicons/react/24/outline/LinkIcon';
import { useLinkProvider, useSiteManifest, useUrlbase, withUrlbase } from '@myst-theme/providers';
import type { SiteManifest } from 'myst-config';
import type { NodeRenderer } from '@myst-theme/providers';
import { HoverPopover } from '../components/HoverPopover';
import { LinkCard } from '../components/LinkCard';
import { WikiLink } from './wiki';
import { RRIDLink } from './rrid';
import { GithubLink } from './github';

type TransformedLink = Link & { internal?: boolean; protocol?: string };

type ManifestProjectItem = Required<SiteManifest>['projects'][0]['pages'][0];

function getPageInfo(
  site: SiteManifest | undefined,
  path: string,
): ManifestProjectItem | undefined {
  if (!site) return undefined;
  const [projectSlug, pageSlug] = path.replace(/^\//, '').split('/');
  const project = site.projects?.find((p) => p.slug === projectSlug);
  if (!project) return undefined;
  return project.pages.find(
    (p) => (p as ManifestProjectItem).slug === pageSlug,
  ) as ManifestProjectItem;
}

function InternalLink({ url, children }: { url: string; children: React.ReactNode }) {
  const Link = useLinkProvider();
  const site = useSiteManifest();
  const page = getPageInfo(site, url);
  const urlbase = useUrlbase();
  const skipPreview = !page || (!page.description && !page.thumbnail);
  if (!page || skipPreview) {
    return (
      <Link to={withUrlbase(url, urlbase)} prefetch="intent">
        {children}
      </Link>
    );
  }
  return (
    <HoverPopover
      card={
        <LinkCard
          internal
          url={url}
          title={page.title}
          description={page.description}
          thumbnail={page.thumbnailOptimized || page.thumbnail}
        />
      }
    >
      <Link to={withUrlbase(url, urlbase)} prefetch="intent">
        {children}
      </Link>
    </HoverPopover>
  );
}

export const link: NodeRenderer<TransformedLink> = (node, children) => {
  const internal = node.internal ?? false;
  const protocol = node.protocol;

  switch (protocol) {
    case 'wiki':
      return (
        <WikiLink
          key={node.key}
          url={node.url}
          page={node.data?.page as string}
          wiki={node.data?.wiki as string}
        >
          {children}
        </WikiLink>
      );
    case 'github':
      return (
        <GithubLink
          key={node.key}
          url={node.url}
          org={node.data?.org as string}
          repo={node.data?.repo as string}
          raw={node.data?.raw as string}
          file={node.data?.file as string}
          from={node.data?.from as number | undefined}
          to={node.data?.to as number | undefined}
        >
          {children}
        </GithubLink>
      );
    case 'rrid':
      return <RRIDLink key={node.key} rrid={node.data?.rrid as string} />;
    default:
      if (internal) {
        return (
          <InternalLink key={node.key} url={node.url}>
            {children}
          </InternalLink>
        );
      }
      return (
        <a key={node.key} target="_blank" href={node.url} rel="noreferrer">
          {children}
        </a>
      );
  }
};

export const linkBlock: NodeRenderer<TransformedLink> = (node, children) => {
  const iconClass = 'w-6 h-6 self-center transition-transform flex-none ml-3';
  const containerClass =
    'flex-1 p-4 my-5 block border font-normal hover:border-blue-500 dark:hover:border-blue-400 no-underline hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-100 border-gray-200 dark:border-gray-500 rounded shadow-sm hover:shadow-lg dark:shadow-neutral-700';
  const internal = node.internal ?? false;
  const nested = (
    <div className="flex align-middle h-full">
      <div className="flex-grow">
        {node.title}
        <div className="text-xs text-gray-500 dark:text-gray-400">{children}</div>
      </div>
      {internal && <LinkIcon className={iconClass} />}
      {!internal && <ExternalLinkIcon className={iconClass} />}
    </div>
  );

  if (internal) {
    return (
      <a key={node.key} href={node.url} className={containerClass}>
        {nested}
      </a>
    );
  }
  return (
    <a
      key={node.key}
      className={containerClass}
      target="_blank"
      rel="noopener noreferrer"
      href={node.url}
    >
      {nested}
    </a>
  );
};

const LINK_RENDERERS = {
  link,
  linkBlock,
};

export default LINK_RENDERERS;
