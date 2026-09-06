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
      lights: {
        red: { confirmed: 'Suspended', predicted: 'Cancellation likely' },
        yellow: { confirmed: 'Temporarily paused', predicted: 'Sailing caution' },
        green: 'Running',
        closed: 'Service ended',
        gray: 'Needs checking',
      },
      outlook: {
        green: 'Good',
        yellow: 'Caution',
        red: 'High likelihood of service disruption',
        closed: 'No sailings',
        gray: 'Needs checking',
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
    },
    nav: { menu: 'Menu', close: 'Close' },
    theme: { light: 'Light', dark: 'Dark' },
  },
  nav: [{ label: 'Home' }, { label: 'Udo' }, { label: 'Udo Now' }],
  appPage: {
    subtitle:
      'A travel and daily-info app for the small island just off Jeju — it grew out of the ' +
      'inconveniences I noticed going back and forth, and I design, build and run it as an ' +
      'independent project.',
    intro:
      'Udo is reachable only by ferry, and sailings can be cancelled depending on the weather. ' +
      'So residents and visitors alike keep asking the same question: “Is the boat running right ' +
      'now?” Udo Now answers it — sailing / caution / cancelled — and the moment a cancellation ' +
      'is decided, it sends the details as a push notification.',
    featuresTitle: 'What the app does',
    features: [
      {
        title: 'Ferry traffic light',
        desc:
          'One look tells you whether boats are sailing now, today and tomorrow — green, amber or ' +
          'red — with the reason in plain words, the fare table, and a push alert once a ' +
          'bad-weather cancellation is decided.',
      },
      { title: 'Tide & weather outlook', desc: 'Tides and the weather outlook really matter on an island — check what the weather holds before you travel.' },
      { title: 'Bus arrivals', desc: 'Live arrival times for the buses to each ferry terminal, plus the village bus routes and stops on the island itself.' },
      { title: 'Harbour CCTV', desc: 'Harbour cameras let you see what the harbour looks like right now.' },
      { title: 'Sights & photo gallery', desc: 'The island’s classic sights alongside the Udo that locals themselves recommend.' },
      { title: 'Restaurants, cafés & stays', desc: 'Shops on a map with category filters — open or closed today, one-tap phone call, and directions.' },
      { title: 'Jeju language', desc: 'Learn the island’s own dialect: a placement test, questions graded by level, repeat-after-me practice, and more.' },
      { title: 'Haenyeo mini-game', desc: '“Aesim’s Day” — play as a haenyeo, harvest sea urchins and conch, rise from the lowest rank to master diver, and reach the folk-tale ending.' },
    ],
    soonLabel: 'In development',
    whyTitle: 'Why I build it',
    why: [
      'On Udo you end up checking the ferry schedule far more often than you would expect. Is it sailing normally today? Has the wind moved the departure times? What time is the last boat back? For a visitor that is a question about the day’s plans; for someone who lives on the island, the ferry is simply how daily life gets around.',
      'Yet none of it lived in one place. Departure times were on one website, cancellations in a notice-board post, wind and weather somewhere else again — and there was no easy way to tell where the bus had got to.',
      '“It would be good to be able to get the ferry information Udo needs” — that thought is where Udo Now started.',
      'It began by showing sailing and cancellation status, and building it kept revealing what else was missing — an alert the moment a sailing is cancelled or changed, bus arrival times, weather and tides, the state of the harbour, and multilingual information for visitors from abroad.',
      'Along the way Udo Now became less a tourist-information app and more a service that shows what you need on Udo right now.',
      'What matters most to me in building it is not producing new information, but taking what already exists — hard to find, scattered across places — and delivering it at the moment it is needed.',
      'If you ever make it to Udo, I hope the app helps.',
    ],
  },

  home: {
    hero: {
      title: 'Recording Udo',
      lead:
        'The time people lived here, the words that are disappearing, the landscapes someone left behind.',
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
