import PlayCircleIcon from '@heroicons/react/24/outline/PlayCircleIcon';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import MinusCircleIcon from '@heroicons/react/24/outline/MinusCircleIcon';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import ArrowUturnLeft from '@heroicons/react/24/outline/ArrowUturnLeftIcon';
import Bolt from '@heroicons/react/24/outline/BoltIcon';
import classNames from 'classnames';
import { Spinner } from './Spinner';
import PowerIcon from '@heroicons/react/24/outline/PowerIcon';

export function SpinnerStatusBadge({
  ready,
  busy,
  modified,
}: {
  ready: boolean;
  modified: boolean;
  busy: boolean;
}) {
  let title = 'Enable compute to make this figure interactive';
  if (ready) {
    title = modified ? 'This figure has been modified' : "This figure in it's original state";
  }

  return (
    <div className="relative flex text-sm">
      <div
        className={classNames(' active: bg-white', {
          'text-gray-700': !ready,
          'text-blue-700': ready && !modified,
          'text-green-700': ready && modified,
          'opacity-10': busy,
          'opacity-70': !busy,
        })}
        title={title}
        aria-label={`status`}
      >
        <Bolt className="w-6 h-6" />
      </div>
      {busy && (
        <span className="absolute top-0 left-0 z-10 w-[22px] h-[22px] opacity-100">
          <Spinner size={24} />
        </span>
      )}
    </div>
  );
}

function SpinnerButton({
  ready,
  icon,
  busy,
  disabled,
  title,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  ready: boolean;
  busy: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative flex text-sm">
      <button
        className={classNames(
          'cursor-pointer text-gray-700 active:text-green-700 bg-white hover:opacity-100',
          {
            'opacity-10 hover:opacity-10': busy,
            'opacity-70': !busy,
          },
        )}
        disabled={disabled || !ready || busy}
        onClick={() => onClick()}
        title={title ?? 'run all cells'}
        aria-label={title ?? 'run all cells'}
      >
        {icon}
      </button>
      {busy && (
        <span className="absolute top-0 left-0 z-10 w-[22px] h-[22px] opacity-100">
          <Spinner size={24} />
        </span>
      )}
    </div>
  );
}

export function Run({
  ready,
  executing,
  disabled,
  title,
  onClick,
}: {
  ready: boolean;
  executing: boolean;
  title?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <SpinnerButton
      ready={ready}
      busy={executing}
      disabled={disabled}
      title={title ?? 'run all cells'}
      onClick={onClick}
      icon={<PlayCircleIcon className="inline-block w-6 h-6 align-top" />}
    />
  );
}

export function Power({
  ready,
  executing,
  disabled,
  title,
  onClick,
}: {
  ready: boolean;
  executing: boolean;
  title?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <SpinnerButton
      ready={ready}
      busy={executing}
      disabled={disabled}
      title={title ?? 'enable compute'}
      onClick={onClick}
      icon={<PowerIcon className="inline-block w-6 h-6 align-top" />}
    />
  );
}

export function ReRun({
  ready,
  executing,
  disabled,
  title,
  onClick,
}: {
  ready: boolean;
  executing: boolean;
  title?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <SpinnerButton
      ready={ready}
      busy={executing}
      disabled={disabled}
      title={title ?? 'run all cells'}
      onClick={onClick}
      icon={<ArrowPathIcon className="inline-block w-6 h-6 align-top" />}
    />
  );
}

export function Reset({
  ready,
  restarting,
  disabled,
  title,
  onClick,
}: {
  ready: boolean;
  restarting: boolean;
  title?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <SpinnerButton
      ready={ready}
      busy={restarting}
      disabled={disabled}
      title={title ?? 'reset notebook'}
      onClick={onClick}
      icon={<ArrowUturnLeft className="inline-block w-6 h-6 align-top" />}
    />
  );
}

export function Clear({
  ready,
  disabled,
  title,
  onClick,
}: {
  ready: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={classNames('flex text-gray-700 opacity-60 ', {
        'cursor-not-allowed': disabled || !ready,
        'active:text-green-700 hover:opacity-100 cursor-pointer': !disabled,
      })}
      disabled={disabled || !ready}
      onClick={() => onClick()}
      title={title ?? 'clear'}
      aria-label={title ?? 'clear'}
    >
      <MinusCircleIcon className="inline-block w-6 h-6 align-top" />
    </button>
  );
}

export function Launch({
  ready,
  disabled,
  title,
  onClick,
}: {
  ready: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex items-center text-gray-700 cursor-pointer active:text-green-700 opacity-60 hover:opacity-100"
      disabled={disabled || !ready}
      onClick={() => onClick()}
      title={title ?? 'launch in jupyter'}
      aria-label={title ?? 'launch in jupyter'}
    >
      <ArrowTopRightOnSquareIcon className="inline-block w-6 h-6 align-top" />
    </button>
  );
}
