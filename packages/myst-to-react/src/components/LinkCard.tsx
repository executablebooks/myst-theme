import { useLinkProvider } from '@myst-theme/providers';
import ExternalLinkIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import classNames from 'classnames';

export function LinkCard({
  url,
  title,
  internal = false,
  loading = false,
  description,
  thumbnail,
  className = 'w-[300px]',
}: {
  url: string;
  internal?: boolean;
  loading?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  thumbnail?: string;
  className?: string;
}) {
  const Link = useLinkProvider();
  return (
    <div className={classNames(className, { 'animate-pulse': loading })}>
      {internal && (
        <Link to={url} className="block text-inherit hover:text-inherit" prefetch="intent">
          {title}
        </Link>
      )}
      {!internal && (
        <a
          href={url}
          className="block text-inherit hover:text-inherit"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLinkIcon className="w-4 h-4 float-right" />
          {title}
        </a>
      )}
      {!loading && thumbnail && (
        <img src={thumbnail} className="w-full max-h-[200px] object-cover object-top" />
      )}
      {loading && (
        <div className="animate-pulse bg-slate-100 dark:bg-slate-800 w-full h-[150px] mt-4" />
      )}
      {!loading && description && <div className="mt-2">{description}</div>}
    </div>
  );
}
