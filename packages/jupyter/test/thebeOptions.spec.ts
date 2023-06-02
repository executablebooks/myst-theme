import type { BinderProviders, Thebe } from 'myst-frontmatter';
import { ExtendedCoreOptions, thebeFrontmatterToOptions } from '../src/utils';

describe('transforming thebe frontmatter', () => {
  test.each([
    ['thebe: undefined', undefined, undefined, undefined, undefined],
    ['thebe: false', false, undefined, undefined, undefined],
    ['thebe: true', true, undefined, undefined, {}],
    ['thebe: empty', {}, undefined, undefined, {}],
    [
      'thebe: true; github - owner/repo',
      true,
      `executablebooks/thebe-binder-base`,
      undefined,
      {
        useBinder: true,
        binderOptions: { repo: 'executablebooks/thebe-binder-base', ref: 'HEAD' },
      },
    ],
    [
      'thebe.binder: true; github - owner/repo',
      { binder: true },
      `executablebooks/thebe-binder-base`,
      undefined,
      {
        useBinder: true,
        binderOptions: { repo: 'executablebooks/thebe-binder-base', ref: 'HEAD' },
      },
    ],
    [
      'thebe: true; github - url',
      true,
      `https://github.com/executablebooks/thebe-binder-base`,
      undefined,
      {
        useBinder: true,
        binderOptions: { repo: 'executablebooks/thebe-binder-base', ref: 'HEAD' },
      },
    ],
    [
      'thebe.binder: true; github - url',
      { binder: true },
      `https://github.com/executablebooks/thebe-binder-base`,
      undefined,
      {
        useBinder: true,
        binderOptions: { repo: 'executablebooks/thebe-binder-base', ref: 'HEAD' },
      },
    ],
    [
      'thebe: true; binder - url 1; github',
      true,
      `https://github.com/executablebooks/thebe-binder-base`,
      'https://xhrtcvh6l53u.curvenote.dev/services/binder/v2/gh/executablebooks/thebe-binder-base/main',
      {
        useBinder: true,
        binderOptions: {
          binderUrl: 'https://xhrtcvh6l53u.curvenote.dev/services/binder',
          repo: 'executablebooks/thebe-binder-base',
          ref: 'main',
        },
      },
    ],
    [
      'thebe.binder: true; binder - url 1; github',
      { binder: true },
      `https://github.com/executablebooks/thebe-binder-base`,
      'https://xhrtcvh6l53u.curvenote.dev/services/binder/v2/gh/executablebooks/thebe-binder-base/main',
      {
        useBinder: true,
        binderOptions: {
          binderUrl: 'https://xhrtcvh6l53u.curvenote.dev/services/binder',
          repo: 'executablebooks/thebe-binder-base',
          ref: 'main',
        },
      },
    ],
    [
      'thebe: true; binder - url 2; github',
      true,
      `https://github.com/executablebooks/thebe-binder-base`,
      'https://mybinder.org/v2/gh/executablebooks/thebe-binder-base/main',
      {
        useBinder: true,
        binderOptions: {
          binderUrl: 'https://mybinder.org',
          repo: 'executablebooks/thebe-binder-base',
          ref: 'main',
        },
      },
    ],
    [
      'thebe.binder: true; binder - url 2; github',
      { binder: true },
      `https://github.com/executablebooks/thebe-binder-base`,
      'https://mybinder.org/v2/gh/executablebooks/thebe-binder-base/main',
      {
        useBinder: true,
        binderOptions: {
          binderUrl: 'https://mybinder.org',
          repo: 'executablebooks/thebe-binder-base',
          ref: 'main',
        },
      },
    ],
    [
      'thebe: true; binder - url 2; no github',
      true,
      undefined,
      'https://mybinder.org/v2/gh/executablebooks/thebe-binder-base/main',
      {
        useBinder: true,
        binderOptions: {
          binderUrl: 'https://mybinder.org',
          repo: 'executablebooks/thebe-binder-base',
          ref: 'main',
        },
      },
    ],
    [
      'thebe.binder: true; binder - url 2; no github',
      { binder: true },
      undefined,
      'https://mybinder.org/v2/gh/executablebooks/thebe-binder-base/main',
      {
        useBinder: true,
        binderOptions: {
          binderUrl: 'https://mybinder.org',
          repo: 'executablebooks/thebe-binder-base',
          ref: 'main',
        },
      },
    ],
    ['thebe: true; no github, no binder - fallback to direct', true, undefined, undefined, {}],
    [
      'thebe.binder: true; no github, no binder - use binder with the thebe defaults',
      { binder: true },
      undefined,
      undefined,
      { useBinder: true },
    ],
    [
      'thebe.server: true; direct connect with defaults',
      { server: true },
      undefined,
      undefined,
      {},
    ],
    [
      'thebe.lite: true; jupyter lite',
      { lite: true },
      undefined,
      undefined,
      { useJupyterLite: true },
    ],
  ])('shortcut cases %s', (s, thebe, githubBadgeUrl, binderBadgeUrl, result) => {
    expect(thebeFrontmatterToOptions(thebe, githubBadgeUrl, binderBadgeUrl)).toEqual(result);
  });
  test.each([
    [
      'thebe.binder.*',
      {
        binder: {
          repo: 'executablebooks/thebe-binder-base',
          url: 'https://another.binder.org/services/binder',
          ref: 'branch',
          provider: 'gitlab' as BinderProviders,
        },
      },
      undefined,
      undefined,
      {
        useBinder: true,
        binderOptions: {
          repo: 'executablebooks/thebe-binder-base',
          binderUrl: 'https://another.binder.org/services/binder',
          ref: 'branch',
          repoProvider: 'gitlab' as BinderProviders,
        },
      },
    ],
    [
      'thebe.server.*',
      {
        server: {
          url: 'http://localhost:1234',
          token: 'qwerty123456',
        },
      },
      undefined,
      undefined,
      {
        serverSettings: {
          baseUrl: 'http://localhost:1234',
          token: 'qwerty123456',
        },
      },
    ],
    [
      'thebe.local: true - overrides binder',
      {
        binder: true,
        local: true,
      },
      'executablebooks/thebe-binder-base',
      undefined,
      {
        useBinder: undefined,
        useJuptyerLite: undefined,
      },
    ],
    [
      'thebe.local: true - overrides lite',
      {
        lite: true,
        local: true,
      },
      'executablebooks/thebe-binder-base',
      undefined,
      {
        useBinder: undefined,
        useJuptyerLite: undefined,
      },
    ],
    [
      'thebe.local: true - overrides explicit server settings',
      {
        server: {
          url: 'http://localhost:1234',
          token: 'qwerty123456',
        },
        local: true,
      },
      undefined,
      undefined,
      {
        useBinder: undefined,
        useJuptyerLite: undefined,
      },
    ],
    [
      'thebe.local.* - overrides binder',
      {
        binder: true,
        local: {
          url: 'http://localhost:1234',
          token: 'qwerty123456',
          kernelName: 'funky-chicken',
        },
      },
      undefined,
      undefined,
      {
        useBinder: undefined,
        useJupyterLite: undefined,
        serverSettings: {
          baseUrl: 'http://localhost:1234',
          token: 'qwerty123456',
        },
        kernelOptions: {
          kernelName: 'funky-chicken',
        },
      },
    ],
    [
      'thebe.local.kernelName - overrides binder',
      {
        binder: true,
        local: {
          kernelName: 'funky-chicken',
        },
      },
      undefined,
      undefined,
      {
        kernelOptions: {
          kernelName: 'funky-chicken',
        },
      },
    ],
    [
      'thebe.local.* - overides server settings',
      {
        server: {
          url: 'http://remote:9999',
          token: 'remoteToken',
        },
        kernelName: 'remoteKernel',
        local: {
          url: 'http://local:1234',
          token: 'localToken',
          kernelName: 'localKernel',
        },
      },
      undefined,
      undefined,
      {
        useBinder: undefined,
        useJupyterLite: undefined,
        serverSettings: {
          baseUrl: 'http://local:1234',
          token: 'localToken',
        },
        kernelOptions: {
          kernelName: 'localKernel',
        },
      },
    ],
  ])('explicit options %s', (s, thebe: Thebe, githubBadgeUrl, binderBadgeUrl, result) => {
    expect(thebeFrontmatterToOptions(thebe, githubBadgeUrl, binderBadgeUrl)).toEqual(result);
  });
  test.each([
    [
      'disableSessionSaving',
      {
        disableSessionSaving: true,
      },
      {
        savedSessionOptions: {
          enabled: false,
        },
      },
    ],
    [
      'kernelName',
      {
        kernelName: 'myQuirkyKernel',
      },
      {
        kernelOptions: {
          kernelName: 'myQuirkyKernel',
        },
      },
    ],
    [
      'mathjax',
      {
        mathjaxUrl: 'someUnverifiedUrl',
        mathjaxConfig: 'someConfigString',
      },
      {
        mathjaxUrl: 'someUnverifiedUrl',
        mathjaxConfig: 'someConfigString',
      },
    ],
  ])('additional options %s', (s, thebe: Thebe, result: ExtendedCoreOptions) => {
    expect(thebeFrontmatterToOptions(thebe, undefined, undefined)).toEqual(result);
  });
});