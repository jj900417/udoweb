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
      /* 앱의 app_en.arb 와 같은 문안 — 앱과 웹이 같은 말을 하도록. */
      headlines: {
        manual_red_today: 'Sailing suspended today',
        manual_red_range: 'Suspended until {month}/{day}',
        manual_yellow: 'Sailing temporarily paused',
        manual_green: 'Operating normally today',
        notice_red: 'Sailing suspended today (operator notice)',
        warning_red: 'Cancellation likely due to a weather alert',
        auto_green: 'Operating normally',
        gray_unknown: 'Information unavailable. Please confirm by phone.',
        closed_before_first: 'Before service hours',
        closed_after_last: "Today's service has ended",
      },
      reasons: {
        manual_reason: 'Reason: {reason}',
        resume_when_clear: 'Service resumes once conditions improve',
        closed_until: 'Suspended until {month}/{day}',
        notice_detected: 'Operator suspension notice detected',
        warning_active: '{kind} in effect for eastern Jeju waters',
        warning_minor: '{kind} in effect · little impact on sailings',
        no_warning_no_notice: 'No weather alerts, no suspension notices',
        collect_failed: 'Failed to collect weather/notice info',
        before_first_boat: "Today's first boat hasn't departed yet",
        after_last_boat: 'Service hours have ended',
      },
      warningKinds: {
        typhoon: 'Typhoon',
        alert: 'Warning',
        advisory: 'Advisory',
        preliminary: 'Preliminary alert',
      },
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
