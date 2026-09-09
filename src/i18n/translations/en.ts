import type { Overlay } from '..';

/*
 * English overlay on the Korean canonical (src/data).
 *
 * Arrays merge INDEX-WISE — keep the order identical to src/data, and omit
 * anything that should stay Korean (ids, URLs, phone numbers, coordinates).
 */
export const en: Overlay = {
  site: {
    name: 'Udo',
    tagline: 'A small island off Jeju',
    operator: { name: 'udonow', role: 'Udo information service' },
    appFeaturesTitle: 'What the app does',
    app: {
      name: 'Udo Now',
      desc: 'Is the boat running, when is the bus, what is open — the Udo travel app',
    },
  },

  /*
   * What a searcher reads in the results before deciding to click.
   * Keys are paths, so these merge by key — order does not matter.
   */
  seo: {
    '/': {
      title: 'Udo — records and the island today',
      description:
        'The history, people and landscapes of Udo off Jeju, alongside today\u2019s ferry, bus and shop information.',
    },
    '/about': {
      title: 'About Udo — what kind of island is it',
      description: 'What Udo, the small island east of Jeju, is like and what there is to see.',
    },
    '/now': {
      title: 'Udo now — ferries, weather, current conditions',
      description: 'Whether the boats are running, what the weather is doing, how the harbour looks right now.',
    },
    '/travel': { title: 'Visiting Udo', description: 'What to know before your first trip — getting there, what to see, what to eat, what to watch for.' },
    '/access': { title: 'Getting to Udo — ferries and harbours', description: 'Ferries from Seongsan, where the harbours are, sailing times and fares.' },
    '/spots': { title: 'What to see on Udo — the Eight Views', description: 'Udobong, Geommeolle, Seobinbaeksa and the other places worth the walk.' },
    '/experience': { title: 'Things to do on Udo', description: 'Ways to spend a day on the island.' },
    '/food': { title: 'Eating on Udo — peanuts and seafood', description: 'Peanut ice cream, seafood, and what else the island puts on a plate.' },
    '/tips': { title: 'Udo travel tips — before you go', description: 'Ferry times, getting around the island, what to bring.' },
    '/harbor': { title: 'Udo harbours — right now', description: 'Cheonjin and Haumokdong harbours as they look today.' },
    '/app': { title: 'The Udo Now app', description: 'Is the boat running, when is the bus — the things a visitor needs, in one app.' },
    '/support': { title: 'Support — questions and requests', description: 'Report a problem, a wrong detail, or a request about Udo Now. No sign-in needed.' },
    '/archive': { title: 'The Udo archive', description: 'Keeping a record before it goes. People and works, history and voices.' },
    '/archive/artists': { title: 'People who recorded Udo', description: 'Those who kept Udo in photographs and paintings.' },
    '/archive/works': { title: 'Works — the Udo archive', description: 'Photographs and paintings of the island.' },
    '/archive/collections': { title: 'Collections — the Udo archive', description: 'Records of Udo gathered by theme.' },
    '/archive/exhibitions': { title: 'Exhibitions about Udo', description: 'A record of exhibitions that have shown the island.' },
    '/archive/library': { title: 'Udo reading room', description: 'Books, documents and sources about Udo.' },
    '/history': { title: 'The history of Udo', description: 'From the first people to settle here to the island today.' },
    '/voices': { title: 'Voices of Udo', description: 'Stories told by the people who have lived here.' },
    '/sounds': { title: 'The sounds of Udo', description: 'Waves, wind, and what else the island sounds like.' },
  },

  nav: [{ label: 'Home' }, { label: 'Udo' }, { label: 'Udo Now' }],

  support: {
    title: 'Support',
    subtitle: 'Tell us what went wrong, or what could be better',
    intro:
      'If something broke while you were using Udo Now, if a piece of information is wrong, ' +
      'or if there is something you would like to see, let us know. We read it and use it to ' +
      'improve the service.',
    categoryLabel: 'Type',
    categories: [
      { label: 'Feature request' },
      { label: 'Bug report' },
      { label: 'Info correction' },
      { label: 'Inquiry' },
      { label: 'Other' },
    ],
    titleLabel: 'Title',
    titlePlaceholder: 'Sum it up in one line',
    messageLabel: 'Message',
    messagePlaceholder:
      'When, on which screen, and what happened — details help us find it faster',
    remaining: '{n} characters left',
    emailLabel: 'Reply email (optional)',
    emailHint: 'Enter your email if you would like a reply. You can send without one.',
    envTitle: 'Add your setup',
    envHint: 'For a bug report this helps us find the cause. Optional.',
    platformLabel: 'Platform',
    platforms: [
      { label: 'Not selected' },
      { label: 'iOS' },
      { label: 'Android' },
      { label: 'Web' },
      { label: 'Other' },
    ],
    appVersionLabel: 'App version',
    osVersionLabel: 'OS version',
    privacyTitle: 'How we handle your information',
    privacyBody:
      'We collect what you write and your email address so that we can look into your ' +
      'message and reply to it. We do not use them for anything else.',
    privacyLink: 'Read the privacy policy',
    consentLabel: 'I agree to the collection and use of this information (required)',
    submit: 'Send',
    submitting: 'Sending…',
    doneTitle: 'Your message was received',
    doneBody: 'We use it to look into your report and to improve the service.',
    doneEmail: 'If your message needs a reply, we will write to the address you left.',
    doneAgain: 'Send another message',
    errors: {
      category: 'Please choose a type.',
      title: 'Please enter a title.',
      message: 'Please enter your message.',
      email: 'That email address does not look right.',
      consent: 'Please agree to the collection and use of this information.',
      invalid: 'Please check what you entered.',
      tooMany: 'Too many messages in a short time. Please try again shortly.',
      network: 'Something went wrong while sending. Please try again shortly.',
    },
    altTitle: 'You can email us instead',
    altBody: 'If the form does not work, write to the address below.',
  },
  sideNav: {
    udo: {
      title: 'Udo',
      groups: [
        { label: 'About the island', items: [] },
        {
          label: 'Records of Udo',
          items: [
            { label: 'Artists' },
            { label: 'Collections' },
            { label: 'Time' },
          ],
        },
        {
          label: 'Sounds of Udo',
          items: [{ label: 'Voices' }, { label: 'Sounds' }],
        },
      ],
    },
    now: {
      title: 'Udo Now',
      groups: [
        { label: 'Udo today', items: [] },
        {
          label: 'How to travel the island',
          items: [
            { label: 'Getting here' },
            { label: 'Travel tips' },
            { label: 'Food & shops' },
            { label: 'Harbour' },
          ],
        },
        { label: 'Udo Now app', items: [{ label: 'Support' }] },
      ],
    },
  },

  ui: {
    brand: { name: 'Udo', sub: 'UDO ISLAND' },
    actions: {
      more: 'More',
      call: 'Call',
      openMap: 'Open in map',
      openLink: 'Open',
      retry: 'Retry',
      viewAll: 'View all',
      expand: 'Show',
      collapse: 'Hide',
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
      windDir: 'Direction',
      humidity: 'Humidity',
      wave: 'Waves',
      terminals: {
        cheonjin: 'Cheonjin terminal',
        haumokdong: 'Haumokdong terminal',
        seongsan: 'Seongsan terminal',
        jongdal: 'Jongdal terminal',
      },
      compass: [
        'N', 'NNE', 'NE', 'ENE',
        'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW',
        'W', 'WNW', 'NW', 'NNW',
      ],
    },
    timetable: {
      title: 'Timetable',
      note: 'Times change with season and weather. Actual departures may differ.',
      first: 'First',
      last: 'Last',
      fromNote: 'departing {port}',
    },
    festivals: { dateStatus: { confirmed: 'Confirmed', planned: 'Planned', undecided: 'TBD', cancelled: 'Cancelled' } },
    shops: { title: 'Shops', category: 'Category', hours: 'Hours' },
    cctv: {
      title: 'Harbour CCTV',
      note: 'Source: Jeju City',
      failed: 'Could not load the stream. Please try again shortly.',
    },
    app: {
      about: 'About Udo Now',
      install: 'Install',
      openWeb: 'Open on the web',
      comingSoon: 'App release in preparation',
    },
    footer: { madeBy: 'Made to show what Udo actually looks like.' },
    nav: { menu: 'Menu', close: 'Close' },
    theme: { light: 'Light', dark: 'Dark' },
    notFound: {
      title: 'The tide hasn’t gone out here yet',
      body: 'This page does not exist.',
      home: 'Back home',
    },
  },


  eightViews: [
    { name: 'Jugan Myeongwol', meaning: 'A moon in daylight', desc: 'Sunlight entering Donggan Gyeonggul gathers on the cave ceiling in a round shape, like a moon. Counted first among the eight.', when: 'Around noon on a clear day · at low tide' },
    { name: 'Yahang Eobeom', meaning: 'Fishing boats at night', desc: 'When the squid and hairtail boats go out with their lamps lit, a line of light forms on the horizon. Only visible if you stay the night.', when: 'Summer nights · fishing season' },
    { name: 'Cheonjin Gwansan', meaning: 'Hallasan seen from Cheonjin', desc: 'From Udo, Jeju’s main island lies across the water with Hallasan stretched along it. The first view as you step off the boat.', when: 'Clear mornings' },
    { name: 'Jidu Cheongsa', meaning: 'Blue sand seen from Udobong', desc: 'From the ridge of Udobong the whole island and the sea beyond fit in one view — the widest sight on Udo.', when: 'An hour or two before sunset' },
    { name: 'Jeonpo Mangdo', meaning: 'Udo seen from the sea', desc: 'The island’s profile as you cross from Seongsanpo — low and long, like the back of a resting cow.', when: 'On the boat · on the way over' },
    { name: 'Huhae Seokbyeok', meaning: 'The black cliffs behind the island', desc: 'Behind Udobong, sheer basalt cliffs drop into the sea. On days of high waves the sound is different.', when: 'All year · safely, on calm days' },
    { name: 'Donggan Gyeonggul', meaning: 'The whale cave on the east shore', desc: 'A large cave beside the black sand at the end of Geommeolle beach. Legend says a whale lived here. You can enter depending on the tide.', when: 'Around low tide · check the tide first' },
    { name: 'Seobin Baeksa', meaning: 'White sand on the western shore', desc: 'Not sand but broken coralline algae, piled into a beach. A rare formation, designated a natural monument. Taking the sand away is prohibited.', when: 'Midday · the water is brightest in strong light' },
  ],

  places: [
    { name: 'Seobin Baeksa (Coral Beach)', category: 'Beach', summary: 'A white beach of broken coralline algae. On a clear day the water splits into shades of jade.', tips: 'A natural monument — sand and gravel may not be taken away.' },
    { name: 'Geommeolle Beach', category: 'Beach', summary: 'A beach of black sand. It leads to Donggan Gyeonggul beneath the cliff.', tips: 'Entering the cave depends on the tide — do not approach at high water.' },
    { name: 'Hagosudong Beach', category: 'Beach', summary: 'A shallow, calm white-sand beach. The place for swimming and snorkelling in summer.' },
    { name: 'Udobong & Udo Lighthouse', category: 'Hill · viewpoint', summary: 'The highest point on the island. From the ridge you see the whole island together with Seongsan Ilchulbong.', tips: 'There is almost no shade — go early morning or near sunset in summer.' },
    { name: 'Biyangdo', category: 'Beach', summary: 'A small island joined to Udo by a causeway. Sunrise, camping, and an open horizon.' },
    { name: 'Cheonjin Harbour', category: 'Harbour', summary: 'One of Udo’s gateways. Boats from Seongsan arrive here.' },
    { name: 'Haumokdong Harbour', category: 'Harbour', summary: 'The north-west harbour. Depending on season and tide, boats come in here instead.', tips: 'Check which harbour you leave from — the two are a long walk apart.' },
    { name: 'Udo Haenyeo Resistance Memorial', category: 'Culture · history', summary: 'A place remembering the history of the women divers who organised and spoke out.' },
  ],

  archive: {
    philosophy: {
      body:
        'Udo’s time is changing quickly. The weather changes, the landscape changes, and the people change too. This archive is an attempt to keep that time.',
    },
    hub: {
      eyebrow: 'UDO ARCHIVE',
      title: 'Those who have recorded Udo, and the time they left behind',
      lead:
        'Photographs, history and people are not kept apart here. A single photograph, the record of its time, and the voices of the people who lived it belong together.',
      featured: 'Today’s record',
      about: { title: 'About the island', desc: 'Start with what kind of place Udo is' },
    },
    sections: {
      artists: { title: 'Those who record Udo', sub: 'Artists', desc: 'The people who photographed and drew Udo' },
      works: { title: 'Photographs & records', sub: 'Works', desc: 'The works and records that remain' },
      collections: { title: 'Collections', sub: 'Collections', desc: 'Reading Udo through photographs' },
      exhibitions: { title: 'Exhibitions', sub: 'Exhibitions', desc: 'Shows held online' },
      library: { title: 'Sources behind this time', sub: 'Library', desc: 'Books, local records, papers and articles about Udo' },
      history: { title: 'The time of Udo', sub: 'History', desc: 'Udo’s history, with its sources named', lead: 'From when people first settled on Udo until now, set down with sources named. Where a date is not certain, it is written as uncertain.' },
      sounds: { title: 'Sounds of Udo', sub: 'Sounds of Udo', desc: 'The sounds of the island and the words of its people' },
      voices: { title: 'Voices of Udo', sub: 'Voices of Udo', desc: 'The words and memories of people who have lived here', lead: 'We keep the voices of those who have lived on Udo as they are — the accent, the intonation, and the memory carried in them.' },
      selectedWorks: { title: 'Selected works' },
      biography: { title: 'Life' },
      statement: { title: 'In the artist’s words' },
      related: { title: 'Connected to this record' },
      sources: { title: 'Sources' },
      timeline: { title: 'Timeline' },
      sessions: { title: 'Interview records' },
      clips: { title: 'Listen' },
      people: { title: 'The people who spoke', sub: 'People' },
      more: { title: 'More', sub: 'Elsewhere in the archive' },
      publications: { title: 'Related material', sub: 'Books & Sources' },
    },
    empty: {
      title: 'Being prepared',
      body: 'Nothing is published here yet. Material appears once the originals and their rights and consent have been confirmed.',
      notFound: 'That record does not exist',
      notFoundBody: 'The address may have changed, or the record is not published yet.',
      backToArchive: 'Back to the archive',
      structureOnly: 'For now the structure is here and the material is not. Photographs, records and recordings arrive as rights and consent are confirmed.',
      peopleNote: 'People appear here once the interview and consent process is complete. Without consent we publish neither name nor voice.',
      historyNote: 'Entries are added one at a time, checked against local records and public documents. Dates and events that are not verified are not published.',
      libraryNote: 'Bibliographic details come first, starting with the local gazetteer. Where we have no right to publish the text, only the description and holding are shown.',
    },
    nav: {
      artists: 'Artists',
      works: 'Works',
      collections: 'Collections',
      exhibitions: 'Exhibitions',
      library: 'Library',
    },
    browse: { title: 'Browse', decades: 'Period', tags: 'Subject', places: 'Place', all: 'All', resultCount: '{n} items' },
    recordNote: {
      title: 'About this record',
      body: 'This record holds only what has been confirmed. Some things are missing, and some will be corrected later. If you know differently, please tell us.',
      updated: 'Updated',
      sourceCount: '{n} sources',
    },
    labels: {
      kinds: { artist: 'Person', work: 'Work', collection: 'Collection', exhibition: 'Exhibition', library: 'Material', history: 'History', source: 'Source', voicePerson: 'Voice', session: 'Interview', voiceClip: 'Recording', sound: 'Sound' },
      precision: { exact: '', year: '', decade: 's', approximate: 'circa', unknown: 'date unknown' },
      categories: { settlement: 'Settlement', village: 'Village', haenyeo: 'Haenyeo', agriculture: 'Farming', transport: 'Sea routes & transport', education: 'Education', infrastructure: 'Infrastructure', tourism: 'Tourism', culture: 'Culture & belief', other: 'Other' },
      roles: { photographer: 'Photography', writer: 'Writing', painter: 'Painting', craft: 'Craft', researcher: 'Research', resident: 'Resident recorder', other: 'Other' },
      itemTypes: { book: 'Book', udoji: 'Local gazetteer', periodical: 'Periodical', thesis: 'Thesis', report: 'Report', newspaper: 'Newspaper', map: 'Map', av: 'Audio-visual', other: 'Other' },
    },
    sound: {
      title: 'Sounds of Udo',
      sub: 'Sounds of Udo',
      lead: 'Sound disappears before photographs do. Boat horns, the haenyeo’s breathing whistle, wind between the field walls — recorded on the spot and kept. We note when and where each was recorded, and what the weather was that day.',
      mapTitle: 'Sound map',
      mapLead: 'Press a pin to play what was recorded there.',
      mapPending: 'There are no recordings yet, so there is nothing to place on the map. The first recording will appear here as a pin.',
      recordedAt: 'Recorded',
      weather: 'Weather that day',
      temp: 'Temp',
      wind: 'Wind',
      wave: 'Waves',
      duration: 'Length',
      kindsTitle: 'Kind of sound',
      seasonTitle: 'Season',
      timeTitle: 'Time of day',
      kinds: { wave: 'Waves', wind: 'Wind', boat: 'Boats', bird: 'Birds', haenyeo: 'Haenyeo', village: 'Village', rain: 'Rain', night: 'Night', work: 'Work', other: 'Other' },
      seasons: { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' },
      times: { morning: 'Morning', day: 'Day', evening: 'Evening', night: 'Night' },
    },
    voice: {
      dialect: 'Jeju language',
      standard: 'Standard Korean',
      context: 'The story behind these words',
      listen: 'Listen',
      play: 'Play',
      pause: 'Pause',
      restart: 'From the start',
      slow: 'Play slowly',
      normalSpeed: 'Normal speed',
      repeatTitle: 'Try saying it',
      repeatBody: 'Listen to one sentence and read it aloud after the speaker. Recording is being prepared.',
      noAudio: 'There is no audio for this yet.',
      anonymous: 'Name withheld',
      transcript: 'Read the transcript',
      transcriptNote: 'Transcribed as heard, so the spelling may differ from standard Korean.',
      seek: 'Playback position',
      playing: 'Playing',
      paused: 'Paused',
      recordedOn: 'Recorded on',
      extent: '{min} min recording',
      hasTranscript: 'transcript available',
      consentPublic: 'consented to web publication',
      speakers: 'Speaker',
    },
    work: {
      credit: 'Copyright',
      photographer: 'Photographer',
      title: 'Title',
      date: 'Date taken',
      medium: 'Medium & technique',
      dimensions: 'Dimensions',
      classification: 'Classification',
      accession: 'Accession number',
      acquisition: 'Provenance',
      visibility: 'Status',
      place: 'Place',
      collection: 'Collection',
      unknownArtist: 'Maker unknown',
      publicLabel: 'Published',
      rightsNote: 'Copyright in this photograph belongs to the rights holder. Reproduction or distribution without permission is prohibited.',
      noImage: 'There is no photograph for this record yet.',
      groups: { identity: 'Record', creation: 'Taking', material: 'Form', provenance: 'Provenance & status' },
    },
  },

  home: {
    hero: {
      title: 'Recording Udo',
      lead:
        'The time people lived here, the words that are disappearing, the landscapes photographers left behind.',
    },
    records: {
      title: 'What we record',
      artists: { title: 'Those who recorded Udo' },
    },
    sections: {
      featured: { title: "Today's record", desc: 'One image from the archive' },
      ferry: { title: 'Udo right now', desc: 'Is the boat running today' },
      travel: { title: 'Travel information', desc: 'Getting here · tips · food' },
      app: { title: 'On the island, use the app — Udo Now', desc: '' },
    },
  },

  hubs: {
    travel: {
      title: 'Travel',
      lead:
        'First time on Udo? Start with getting here. Been before? Check what is open.',
      links: {
        access: { title: 'Getting here', desc: 'Sea routes · the steps · getting around' },
        tips: { title: 'Travel tips', desc: 'Common questions and a pre-departure checklist' },
        food: { title: 'Food & shops', desc: 'Peanuts, conch and more — plus shop information' },
        harbor: { title: 'Harbour', desc: 'Live view of Cheonjin and Haumokdong' },
      },
    },
    now: {
      title: 'Udo Now',
      subtitle: 'The island at this moment',
      lead:
        'Ferry status, timetable, events and harbour cameras come live from the Udo Now app server. When the island changes, this changes.',
      links: {
        access: { title: 'More on ferries', desc: 'Timetable and harbour cameras' },
        app: { title: 'Udo Now app', desc: 'Cancellation alerts · bus arrivals · tides' },
      },
      sections: {
        ferry: 'Ferry status',
        timetable: 'Timetable',
        festivals: 'Festivals & events',
        cctv: 'Harbour CCTV',
      },
    },
  },

  harbor: {
    title: 'Harbour',
    subtitle: 'Cheonjin and Haumokdong, right now',
  },

  about: {
    title: 'About Udo',
    subtitle: 'Fifteen minutes by ferry from Seongsanpo — an island shaped like a resting cow',
    lead:
      'Udo lies off Seongsanpo, at the eastern edge of Jeju. Its name means “cow island”, after its shape. Black basalt shores, coral-white sand, field walls of stacked stone, and haenyeo divers who still go out to sea — all on one small island.',
    paragraphs: [
      'Udo is small enough to circle in a day, yet at walking pace a day is not enough. Follow the coast road and the colour of the sea changes every half hour: white coral sand and jade water to the west, black sand and cliffs to the east, shallow calm water to the north.',
      'Islanders lived from both the sea and the fields. Haenyeo harvested conch, abalone and sea urchin; the fields grew peanuts, garlic and spring onion. The peanut — Udo’s best-known food today — is a trace of that farming.',
      'It is easy to treat Udo as a place you see quickly and leave. But delay your ferry by one sailing and stay until the light drops, and you see the face of an island where people live, not a sightseeing stop. This site was made to show that face.',
    ],
    facts: [
      { label: 'Area', value: 'about 6.2 km²' },
      { label: 'Coastline', value: 'about 17 km' },
      { label: 'From Seongsan', value: 'about 15 min by ferry' },
      { label: 'Highest point', value: 'Udobong, 132 m' },
    ],
    keywordsTitle: 'Four ways to understand Udo',
    keywords: [
      { title: 'The haenyeo’s sea', desc: 'A fishing-village island where diving still continues. The women divers’ resistance movement began here.' },
      { title: 'Peanuts and field walls', desc: 'Narrow fields between stone walls that block the wind. Udo peanuts are small and rich.' },
      { title: 'Conch and sea urchin', desc: 'The conch festival in spring, urchin season in early summer. The seasons arrive from the sea first.' },
      { title: 'The boat comes first', desc: 'Strong wind stops the boats. A trip to Udo always begins with the ferry.' },
    ],
  },

  spotsPage: {
    eightTitle: 'The Eight Views of Udo',
    eightSubtitle: 'Eight scenes the islanders have long counted — some appear only when the hour and the tide agree',
    placesTitle: 'Places to go',
    placesSubtitle: 'The spots you actually walk to',
  },

  access: {
    title: 'Getting here',
    subtitle: 'Fifteen minutes by ferry from Seongsanpo or Jongdal',
    routeMapTitle: 'Sea routes',
    mainlandPort: 'Jeju main island',
    islandPort: 'Udo',
    stepsTitle: 'The steps',
    transportTitle: 'Getting around the island',
    steps: [
      {
        title: 'To Seongsanpo / Jongdal terminal',
        desc: 'About an hour from Jeju airport by bus or car. Ferries to Udo run from Seongsanpo and Jongdal. Check the weather and sailing status before you set out.',
      },
      {
        title: 'Boarding declaration · ID',
        desc: 'Photo ID is required to board. Fill in the boarding form and present your ID when buying the ticket. A student card works for children and teenagers.',
      },
      {
        title: 'About 15 minutes at sea',
        desc: 'You will arrive at Cheonjin or Haumokdong. Check which harbour your sailing uses.',
      },
      {
        title: 'Getting around the island',
        desc: 'Loop bus, e-bikes, e-scooters. Udo is small enough to circle in half a day. Bringing a car is possible under the rules.',
      },
    ],
    carPolicy: {
      title: 'Bringing a car',
      desc: 'Bringing a car to Udo is possible under the rules. There are conditions and procedures, and they can change — checking with the ferry operator before you travel is the most reliable.',
    },
    transport: [
      { title: 'Udo loop bus', desc: 'Check in the app.' },
      { title: 'E-bike · scooter', desc: 'Rentals near the harbours. Licence and age conditions vary by operator.' },
      { title: 'Walking', desc: 'About 17 km around the coast road. You can walk it in sections.' },
    ],
  },

  experiences: {
    title: 'Things to do',
    subtitle: 'On an island you can circle in a day, how do you spend it?',
    items: [
      { title: 'Around the coast road', desc: '17 km around the island — two to three hours by bike, a day on foot. The sea changes colour every half hour.', season: 'All year' },
      { title: 'Climbing Udobong', desc: 'Thirty minutes to the top. Seongsan Ilchulbong and the whole island in one view.', season: 'All year · early morning recommended' },
      { title: 'Watching the haenyeo’s sea', desc: 'Diving grounds are a livelihood, not an attraction. Watch quietly from a distance.', season: 'Depends on tide and season' },
      { title: 'Udo Conch Festival', desc: 'The island’s largest festival, held in spring — conch dishes, performances, haenyeo culture programmes.', season: 'Spring (see the events below)' },
      { title: 'Staying the night', desc: 'After the last ferry leaves, Udo is a different island. The night fishing lights can only be seen if you stay.', season: 'All year' },
      { title: 'Donggan Gyeonggul at low tide', desc: 'A cave that opens only when the water withdraws. Around noon the light forms the “daytime moon”.', season: 'Around low tide' },
    ],
    festivalsTitle: 'Festivals & events',
    festivalsSubtitle: 'On now, or coming up',
    etiquetteTitle: 'Please keep in mind',
    etiquette: [
      'Do not enter haenyeo or fishing-village working areas.',
      'Sand and coral gravel at Seobin Baeksa may not be taken away.',
      'Field walls and private fields are livelihoods, not photo backdrops — please stay out.',
      'Take your rubbish off the island. Its disposal capacity is small.',
    ],
  },

  food: {
    title: 'Food',
    items: [
      { title: 'Udo peanuts' },
      { title: 'Peanut ice cream' },
      { title: 'Conch' },
      { title: 'Sea urchin soup & rice' },
      { title: 'Squid' },
      { title: 'Peanut makgeolli' },
    ],
  },

  tips: {
    title: 'Travel tips',
    faq: [
      {
        q: 'Is a day trip enough?',
        a: 'Half a day is enough to go around once. But the best hours on Udo — dusk, the night sea, Udobong at first light — come after the last ferry. The island’s own time begins at the end of the day.',
      },
      {
        q: 'Do sailings get cancelled often?',
        a: 'Strong wind or high waves can cancel sailings. We show live information so sudden changes reach you: check the ferry status on the home screen. The Udo Now app sends a notification when a cancellation is decided.',
      },
      {
        q: 'Can I bring a car?',
        a: 'Bringing a car is possible under the rules for outside vehicles. On the island there are the loop bus, e-bikes and e-scooters.',
      },
      {
        q: 'When is the best time to visit?',
        a: 'Summer has the brightest water; spring and autumn are best for walking. Just before it turns cold is a fine time to come.',
      },
      {
        q: 'Why do tides matter?',
        a: 'Some places, like Donggan Gyeonggul, open only when the water withdraws, and island life is arranged around when the tide comes in and out. The sea itself looks different at high and low tide.',
      },
    ],
    checklistTitle: 'Before you set out',
    checklist: [
      'Photo ID (required to board)',
      'Ferry status for today and tomorrow',
      'The last sailing back, and which harbour it leaves from',
    ],
  },

  appPage: {
    subtitle:
      'A travel and daily-info app for the small island just off Jeju — it grew out of the inconveniences I noticed going back and forth, and I design, build and run it as an independent project.',
    intro:
      'Udo is reachable only by ferry, and sailings can be cancelled depending on the weather. So residents and visitors alike keep asking the same question: “Is the boat running right now?” Udo Now answers it — sailing / caution / cancelled — and the moment a cancellation is decided, it sends the details as a push notification.',
    featuresTitle: 'What the app does',
    features: [
      { title: 'Ferry traffic light', desc: 'One look tells you whether boats are sailing now, today and tomorrow — with the reason in plain words, the fare table, and a push alert once a cancellation is decided.' },
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
};
