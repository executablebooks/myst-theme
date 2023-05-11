import type { Root } from 'mdast';
import type { References, Dependency, SourceFileKind } from 'myst-common';
import type { SiteManifest } from 'myst-config';
import type { PageFrontmatter } from 'myst-frontmatter';
import type { Theme } from '@myst-theme/providers';

export type Heading = {
  slug?: string;
  path?: string;
  title: string;
  short_title?: string;
  level: number | 'index';
  group?: string;
};

export type SiteLoader = {
  theme: Theme;
  config?: SiteManifest;
  CONTENT_CDN_PORT?: string | number;
  MODE?: 'app' | 'static';
  BASE_URL?: string;
};

export type NavigationLink = {
  group?: string;
  title: string;
  url: string;
};

export type FooterLinks = {
  navigation?: {
    prev?: NavigationLink;
    next?: NavigationLink;
  };
};

export type PageLoader = {
  kind: SourceFileKind;
  file: string;
  sha256: string;
  slug: string;
  domain: string; // This is written in at render time in the site
  project: string; // This is written in at render time in the site
  frontmatter: PageFrontmatter;
  mdast: Root;
  references: References;
  footer?: FooterLinks;
  // This may not be defined
  dependencies?: Dependency[];
};
