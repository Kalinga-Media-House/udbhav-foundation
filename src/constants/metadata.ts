import { APPLICATION } from './application';

export const METADATA = {
  DEFAULT_TITLE: `${APPLICATION.NAME} | Official Platform`,
  TITLE_TEMPLATE: `%s | ${APPLICATION.NAME}`,
  DEFAULT_DESCRIPTION: APPLICATION.DESCRIPTION,
  BASE_URL: 'https://udbhavfoundation.in',
  THEME_COLOR_LIGHT: '#FCFCF8',
  THEME_COLOR_DARK: '#101F55',
  OPEN_GRAPH_IMAGE: '/og-image.webp',
  TWITTER_HANDLE: '@udbhav_fdn',
} as const;
