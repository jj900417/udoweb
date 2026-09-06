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
  nav: [{ label: 'Home' }, { label: 'Udo' }, { label: 'Udo Now' }],
  home: {
    hero: {
      eyebrow: 'Udo, Jeju',
      title: 'Recording Udo',
      lead:
        'The time people lived here, the words that are disappearing, the landscapes someone left behind. ' +
        'And whether the ferry is running today.',
      ctaPrimary: { label: 'Enter the archive' },
      ctaSecondary: { label: 'Travel information' },
    },
    records: {
      title: 'What we record',
      artists: { title: 'Those who recorded Udo' },
    },
    sections: {
      featured: { title: "Today's record", desc: 'One image from the archive' },
      ferry: { title: 'Udo right now', desc: 'Is the ferry running? — live assessment from Udo Now' },
      gallery: { title: 'Udo today', desc: 'Recent photos from visitors and local ambassadors' },
      travel: { title: 'Travel information', desc: 'The Eight Views, getting there, what to eat' },
      app: { title: 'On the island, use the app', desc: 'Ferries, buses, tides and CCTV in your hand' },
    },
  },
};
