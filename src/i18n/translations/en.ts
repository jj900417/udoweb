import type { Overlay } from '..';

/*
 * English overlay on the Korean canonical (src/data). Partial by design:
 * anything omitted stays Korean, so translation can be filled in over time.
 * Arrays are merged INDEX-WISE — keep the order identical to src/data.
 */
export const en: Overlay = {
  ui: {
    brand: { name: 'Udo', sub: 'UDO ISLAND' },
    actions: {
      more: 'More',
      call: 'Call',
      openMap: 'Open in map',
      openLink: 'Open',
      retry: 'Retry',
      viewAll: 'View all',
    },
    states: {
      loading: 'Loading…',
      error: 'Could not load this information.',
      empty: 'Nothing to show yet.',
      updatedAt: 'As of',
    },
    ferry: {
      title: 'Ferry status',
      today: 'Today',
      tomorrow: 'Tomorrow',
      source: 'Assessed by Udo Now (KMA alerts/forecast + operator notices)',
      disclaimer: 'Calling the ferry operator is always the most reliable check.',
      lights: {
        green: 'Running',
        yellow: 'Caution',
        red: 'Suspended',
        gray: 'Unconfirmed',
      },
      weatherNow: 'Current conditions',
      temp: 'Temp',
      wind: 'Wind',
      wave: 'Waves',
    },
    timetable: { title: 'Timetable', note: 'Times change with season and weather.' },
    shops: { title: 'Shops', category: 'Category', hours: 'Hours' },
    cctv: { title: 'Live CCTV', note: 'Public CCTV links from Jeju City' },
    footer: {
      madeBy: 'Made to show what Udo actually looks like.',
      dataSource: 'Data sources',
      verifyNote: 'Something wrong? Tell us — the island changes.',
    },
    nav: { menu: 'Menu', close: 'Close' },
    theme: { light: 'Light', dark: 'Dark' },
  },
  nav: [
    { label: 'Home' },
    { label: 'About Udo' },
    { label: 'Eight Views' },
    { label: 'Getting there' },
    { label: 'Things to do' },
    { label: 'Food & shops' },
    { label: 'Photos' },
    { label: 'Travel tips' },
    { label: 'Udo Now app' },
  ],
  home: {
    hero: {
      eyebrow: 'Udo, Jeju',
      title: 'An island where the sea changes colour every half hour',
      lead:
        'Fifteen minutes by ferry from Seongsan. White coral sand and black volcanic beaches, ' +
        'the haenyeo divers’ sea and peanut fields — all on one small island.',
      ctaPrimary: { label: 'See the Eight Views' },
      ctaSecondary: { label: 'Getting there' },
    },
    sections: {
      ferry: { title: 'Is the ferry running today?', desc: 'Live assessment from the Udo Now app.' },
      eight: { title: 'The Eight Views of Udo', desc: 'Eight scenes the islanders have long counted' },
      places: { title: 'Places to go', desc: 'The spots you actually walk to' },
      festivals: { title: 'Festivals & events', desc: 'On now, or coming up' },
      gallery: { title: 'Faces of Udo', desc: 'Photos by local ambassadors and visitors' },
      app: { title: 'On the island, use the app', desc: 'Ferries, buses, tides and CCTV in your hand' },
    },
  },
};
