/*
 * 콘텐츠 단일 소스. 한국어가 canonical 이고, 다른 언어는 src/i18n/translations/
 * 의 오버레이가 이 구조 위에 index-wise 로 덮인다(구조·배열 순서를 맞출 것).
 * 컴포넌트는 useContent() 로만 읽는다 — 직접 import 금지(번역이 안 걸린다).
 */
import { site } from './site';
import { nav } from './nav';
import { sideNav } from './sideNav';
import { home } from './home';
import { about } from './about';
import { appPage } from './appPage';
import { eightViews, places, spotsPage } from './spots';
import { access } from './access';
import { experiences } from './experiences';
import { food } from './food';
import { tips } from './tips';
import { support } from './support';
import { ui } from './ui';
import { archive } from './archive';
import { hubs, harbor } from './hubs';
import { seo } from './seo';

export const content = {
  site,
  seo,
  nav,
  sideNav,
  home,
  about,
  appPage,
  eightViews,
  places,
  spotsPage,
  access,
  experiences,
  food,
  tips,
  support,
  ui,
  archive,
  hubs,
  harbor,
};

export type Content = typeof content;
