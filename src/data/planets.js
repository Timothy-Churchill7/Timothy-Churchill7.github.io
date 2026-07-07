// ---------------------------------------------------------------------------
// PLANET DATA — the single source of truth for the whole system.
// ---------------------------------------------------------------------------
// Edit this file to add/remove planets or moons, retitle sections, recolor,
// or reposition orbits. The scene reads everything from here — you never need
// to touch the camera or rendering code to change content or layout.
//
// Field reference
// ---------------
//   slug         unique id
//   name         label shown floating by the body
//   color        base color (hex) — also tints the orbit ring + panel accent
//   size         radius (world units)
//   orbitRadius  distance of the orbit from its parent (sun for planets,
//                planet for moons)
//   orbitSpeed   orbital angular speed (radians/sec) — smaller = slower
//   initialAngle starting position on the orbit (radians)
//   spinSpeed    self-rotation speed (planets)
//   icon         image under /public/assets/planets/ (omit -> placeholder disc)
//   moons[]      optional sub-items
//
//   content      info-panel content:
//     { title, subtitle?, body?, bullets?, sections?, links? }
//       body     string | string[]                          flowing paragraph(s)
//       bullets  string[]                                   bullet list
//       sections { heading, subtitle?, body?, bullets? }[]  sub-sections
//       links    { label, url }[]                           outbound links
//
//   TEXT MARKUP: body & bullet strings support **bold** and *italic* (rendered
//   by InfoPanel). No other markup — plain text only otherwise.
//
// ORBIT ORDER (sun -> out): education, work, leadership, research, athletics,
// skills, finance. Radii are kept compact so travel between them is quick.
//
// ICONS: work, leadership, and skills (planets) intentionally have no icon and
// render a placeholder disc. Everything else loads from /public/assets/planets/.
// ---------------------------------------------------------------------------

export const PLANETS = [
  {
    slug: 'education',
    name: 'Education',
    color: '#4f8dff',
    size: 3.5,
    orbitRadius: 27,
    orbitSpeed: 0.11,
    initialAngle: 0.4,
    spinSpeed: 0.25,
    icon: 'assets/planets/education.jpg',
    content: {
      title: 'Education',
      subtitle: '',
      sections: [
        {
          heading: 'Amherst College Class of 29 — B.S. Mathematics & Chemistry',
          body: [
            'To me, Amherst represented a chance to explore a wide variety of interests in a place that puts community above all else and has a culture not just of doing well, but of doing good.',
            'Amherst also appealed to me athletically because being able to run as part of a Division III program lets me compete at a high level without sacrificing the things that are most important to me in my college experience: academic rigor and excitement, community involvement, and having the time to relax and enjoy my college experience.',
            'So far, I have a 3.9/4.0 GPA and my favorite classes have been The Cinema of Pedro Almodóvar (Spanish) and Groups, Rings, and Fields (Math).',
            'I have loved my college experience up to this point and I am so grateful to all my friends and professors that have made my it what it is so far.',

          ],
          bullets: [
            '**Favorite Memory:** Spending an hour trying to convince the rest of my spanish class that the kidnapper in *Átame* was the good guy',
            '**Personal Shoutout:** Professor Sanchez-Eppler taught my seminar, and inspired confidence and a desire for reflection on our families and experience with language',
            '**Favorite Building:** Beneski Museum or The Cage',
            '**Least Favorite Building:** SMUD',
            ],
        },
        {
          heading: 'Noble and Greenough School Class of 2024',
          body: ['Nobles was an amazing place to go to high school: I was academically inspired and challenged, curiousity was encouraged and rewarded, and my teachers were passionate and  truly cared about me as a student and as a person.',
            'The community was strong, and I had the chance to contribute to welcoming the next wave of kids as an elected captain of cross country, skiing, and track, and through my engagement with the Mental Health Club and other communities on campus.',
          'I graduated Nobles with a 10.9/11 GPA earning Highest Academic Distinction. My favorite classes were Advanced Topics in Mathematics, Biochemistry Research, and Artificial Intelligence.',
                ],
          bullets: [
            '**Favorite Memory:** Endless games of spikeball in between classes and after lunch',
            '**Personal Shoutout:** Señor Mr. Profe Coach Ulrich was my teacher, my coach, and my advisor through it all - carpe diem',
            '**Favorite Building:** The Castle (Obviously)',
            '**Least Favorite Building:** Baker',
            ],
        },
      ],
    },
    moons: [
      {
        slug: 'gap-year',
        name: 'Gap Year',
        color: '#b3d0ff',
        size: 1.2,
        orbitRadius: 5.5,
        orbitSpeed: 0.5,
        initialAngle: 1.0,
        icon: 'assets/planets/gap-year.jpg',
        content: {
          title: 'Gap Year',
          subtitle: 'September 2024–August 2025',
          sections: [
            {
              heading: 'Fall',
              body: ['In September I began the Where There Be Dragons Andes and Amazon Fall Semester, a 77 day journey through Bolivia and Peru that consisted of homestays, backpacking, and exploring history and culture in cities across the region.',
                    'We backpacked through the Andes, watched a rally race and talked to the drivers, and became a part of families for weeks at a time. Along the way, we improved our Spanish and learned how to say some important things in Quechua.',
                  ],
              bullets: [
                '**Favorite Memory:** Playing fútbol and chewing Coca with my homestay brother Romario and his friends',
                '**Personal Shoutout:** My three instructors, Yim, Maren, and Jose, and the eight other kids I took the journey with. (Even Rory) ',
                '**Favorite Place:** Sleeping under the stars in the Quelccaya Glacier, on the last day of the last trek right at the end of our semester',
                '**Worst Memory:** Food poisining on the 100º, 12 hour night bus from Lake Titicaca to Puerto Maldonado',
                '**Favorite Quechua Word:** Tuyusiki',
              ],
            },
            {
              heading: 'Winter',
              body: ['After spending less than 72 hours at home, I set out to start my job working as a busser at the Goldminer\'s Daughter lodge in Alta, Utah. This Winter I skied more than 100 days but refrained from learning to backflip as per my mother\'s request.',
                'I learned how to live and operate completely on my own and show up for something with accountability and consistency, and how to properly ski powder, after being raised on the East Coast.',
              ],
              bullets: [
                '**Favorite Memory:** Showing up to work early to fold hundreds oragami napkin hearts for Valentines day',
                '**Personal Shoutout:** My fellow bussers, Lara and Diana.',
                '**Favorite Trail:** High Traverse --> Garbage Chute --> North Rustler',
                '**Biggest Wipeout:** Attempting to send a cliff in Supreme Bowl, double ejecting and rolling 50 feet down the mountain',
              ],
            },
            {
              heading: 'Spring',
              body: '',
              bullets: [
                '**Favorite Memory:** ',
                '**Personal Shoutout:** ',
                '**Favorite Place:** ',
                '**Worst Memory:** ',
              ],
            },
            {
              heading: 'Summer',
              body: '',
              bullets: [
                '**Favorite Memory:** ',
                '**Personal Shoutout:** ',
                '**Favorite Place:** ',
                '**Worst Memory:** ',
              ],
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'work',
    name: 'Work Experience',
    color: '#ff6a3d',
    size: 4.5,
    orbitRadius: 45,
    orbitSpeed: 0.075,
    initialAngle: 0.9,
    spinSpeed: 0.15,
    // icon: missing — no "work" graphic supplied (placeholder disc for now)
    content: {
      title: 'Work Experience',
      subtitle: '',
      body: 'The jobs I’ve had have ranged from being a rowdy camp counselor charged with bringing excitement and energy to the day to a professional, polished restaurant staff at a luxury ski resort. I can manage a full stack deployment of a company site just as well as a pile of 7 year olds climbing on me like a jungle gym. Whatever it is I’m doing, though, I always make sure to bring my personality: easy to laugh and smile but also ready to lend a hand or an ear when it’s needed. I’m a quick learner and I am excited to try new things, meet new people, and learn how to make more of an impact than I ever thought possible.',
    },
    moons: [
      {
        slug: '23-cubed',
        name: '23 Cubed',
        color: '#ffcaa8',
        size: 1.2,
        orbitRadius: 6.5,
        orbitSpeed: 0.5,
        initialAngle: 1.0,
        icon: 'assets/planets/23-cubed.png',
        content: {
          title: '23 Cubed — Junior Developer',
          subtitle: 'June–August 2022',
          body: 'I took ownership of a complete full-stack redeployment of the company site (23cubed.com), and developed and deployed four client websites using Webflow, JavaScript, CSS, and HTML.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
      {
        slug: 'nobles-day-camp',
        name: 'Nobles Day Camp',
        color: '#ff9260',
        size: 1.2,
        orbitRadius: 8.5,
        orbitSpeed: 0.42,
        initialAngle: 3.4,
        icon: 'assets/planets/nobles-day-camp.jpg',
        content: {
          title: 'Nobles Day Camp — Swing Counselor',
          subtitle: 'June–August 2024',
          body: 'I adapted daily to new camper groups ages 6–13, coordinating activities and building relationships through rapidly changing group dynamics. I earned the “You’re a Hoot” award as one of the top three counselors of the week (~top 2%), recognized for leadership, adaptability, and fostering positive camper engagement.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
      {
        slug: 'goldminers-daughter',
        name: "Goldminer's Daughter",
        color: '#d64a24',
        size: 1.2,
        orbitRadius: 10.5,
        orbitSpeed: 0.34,
        initialAngle: 5.5,
        icon: 'assets/planets/goldminers-daughter.png',
        content: {
          title: "The Goldminer's Daughter Lodge — Dining Room Server",
          subtitle: 'December 2024–March 2025',
          body: 'I served 50+ tables per shift in a high-volume luxury ski lodge, communicating in both English and Spanish in a fast-paced hospitality environment.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
      {
        slug: 'icode',
        name: 'iCode',
        color: '#a83714',
        size: 1.2,
        orbitRadius: 12.5,
        orbitSpeed: 0.28,
        initialAngle: 2.3,
        icon: 'assets/planets/icode.jpeg',
        content: {
          title: 'iCode — Counselor',
          subtitle: 'June–August 2021',
          body: 'A coding and tech summer camp for kids; I was responsible for roughly 15 campers ages 7–12.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
    ],
  },
  {
    slug: 'leadership',
    name: 'Leadership & Service',
    color: '#2f7d4e',
    size: 4.5,
    orbitRadius: 69,
    orbitSpeed: 0.05,
    initialAngle: 3.1,
    spinSpeed: 0.16,
    // icon: missing — no "leadership" graphic supplied (placeholder disc for now)
    content: {
      title: 'Leadership & Service',
      subtitle: '',
      body: 'My COVID tinted freshman year of high school was a time when I struggled with my mental health. Through a life changing backpacking trip and a strong support network, I had a much better time through the rest of high school. But I carried with me a love for the outdoors and an appreciation for the resources I had access to, that not everyone does. Since then, my service work has been defined by these two themes: working to connect people (friends, family, strangers) to the outdoors and provide them with physical and mental health support. I’ve learned how and when to lend a kind ear and I’ve seen people transform over three days in the forest. I’ve served my Amherst community as an EMT and helped people cross a language barrier to communicate their stress, their desires, and their life stories for their asylum cases.',
    },
    moons: [
      {
        slug: 'aas-senator',
        name: 'AAS Senator',
        color: '#a8e2bd',
        size: 1.2,
        orbitRadius: 6,
        orbitSpeed: 0.55,
        initialAngle: 0,
        icon: 'assets/planets/aas-senator.webp',
        content: {
          title: 'AAS Senator',
          subtitle: 'September 2025–Present',
          body: 'Twice elected as one of 8 Senators; appointed to 4 committees, including the Committees for Mental Health and Sustainability.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
      {
        slug: 'samaritans',
        name: 'Samaritans Helpline',
        color: '#6cc78a',
        size: 1.2,
        orbitRadius: 8,
        orbitSpeed: 0.44,
        initialAngle: 2.0,
        icon: 'assets/planets/samaritans.jpg',
        content: {
          title: 'Samaritans Crisis Services — Helpline Volunteer',
          subtitle: 'August 2023–May 2024',
          body: 'I completed 40+ hours of crisis-response training to staff weekly 3-hour helpline shifts. I assessed suicide risk and supported callers through 10–60+ minute conversations, making high-stakes decisions independently.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
      {
        slug: 'backpacking',
        name: 'Backpacking — Trip Leader',
        color: '#3f9d63',
        size: 1.2,
        orbitRadius: 10,
        orbitSpeed: 0.36,
        initialAngle: 4.2,
        icon: 'assets/planets/backpacking.avif',
        content: {
          title: 'Backpacking — Trip Leader',
          subtitle: 'July 2024–Present',
          body: [
            'I’ve initiated, organized, and led backpacking trips across New Hampshire, Vermont, California, South Dakota, Utah, and Peru — planning food, Leave No Trace principles, water treatment, budget, route, transportation, evacuation and emergency procedures, first aid, and reflection/improvement exercises for group sizes ranging from 1 to 14. Two trips I’m especially proud of:',
            'A 3-day trip up to Glaciar Quelccaya in Peru — planned and led for 12 people, conducted entirely in Spanish, on a limited budget.',
            'A 4-day trip into the Vermont woods just two months into college — bringing 14 people (mostly backpacking newbies) together to connect and make friends at the very start of college.',
          ],
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
      {
        slug: 'emergency-medicine',
        name: 'Amherst College EMS / Med-13',
        color: '#266b41',
        size: 1.2,
        orbitRadius: 12,
        orbitSpeed: 0.3,
        initialAngle: 5.6,
        icon: 'assets/planets/emergency-medicine.webp',
        content: {
          title: 'Amherst College EMS (Med-13)',
          subtitle: 'January 2026–Present',
          body: 'I completed a 26-day EMT certification and deployed as a Med-13 responder, working 12-hour shifts responding to on-campus emergency calls beginning March 2026.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
      {
        slug: 'kind',
        name: 'K.I.N.D. Translation',
        color: '#164d2e',
        size: 1.2,
        orbitRadius: 14,
        orbitSpeed: 0.24,
        initialAngle: 3.0,
        icon: 'assets/planets/kind.jpg',
        content: {
          title: 'Spanish Translation & Interpretation — K.I.N.D.',
          subtitle: 'June 2025–Present',
          body: 'I completed Spanish fluency testing, interpreted live for an ongoing asylum case between an attorney and client, and continue to serve as an on-call legal document translator for immigration cases.',
          bullets: [
            '**Favorite Memory:** ',
            '**Personal Shoutout:** ',
            '**Favorite Place:** ',
            '**Worst Memory:** ',
          ],
        },
      },
    ],
  },
  {
    slug: 'research',
    name: 'Research',
    color: '#9aa1ad',
    size: 3,
    orbitRadius: 84,
    orbitSpeed: 0.04,
    initialAngle: 2.1,
    spinSpeed: 0.3,
    icon: 'assets/planets/research.png',
    content: {
      title: 'Research',
      subtitle: 'June 2026–Present',
      body: [
        'I synthesize quantum dot particles and run photocatalysis experiments to improve the efficiency of artificial photosynthesis.',
        'This lab is where my hard computational and technical skills meet a love for the planet and a desire to contribute to the fight against climate change — sustainability is the "why" behind the work.',
        'Using Claude Code, I wrote and deployed a holistic web-based data-visualization tool for TEM, UV-Vis, Emission, and Lifetime data.',
        'Techniques & instrumentation: TEM, UV-Vis, PL emission, Schlenk line technique, lifetime measurement, mass spectrometry.',
      ],
      bullets: [
        '**Favorite Memory:** ',
        '**Personal Shoutout:** ',
        '**Favorite Place:** ',
        '**Worst Memory:** ',
      ],
      links: [
        { label: 'Spectra Plotter — data-viz tool', url: 'https://spectra-plotter.onrender.com/' },
      ],
    },
  },
  {
    slug: 'athletics',
    name: 'Athletics',
    color: '#eef0f6',
    size: 3.5,
    orbitRadius: 92,
    orbitSpeed: 0.032,
    initialAngle: 5.3,
    spinSpeed: 0.22,
    icon: 'assets/planets/athletics.png',
    content: {
      title: 'Athletics',
      subtitle: 'September 2025–Present',
      body: [
        'I walked on to Division III cross country and track & field after trying — and failing — to be recruited out of high school. Part of the motivation for taking a gap year was to keep developing as a runner and improve my odds of making the team.',
        'I commit 20+ hours a week as part of a New England D3 Championship and NESCAC Championship team.',
        'I’m an 800m specialist. Personal bests: an 800m split of 1:53.89, a 1500m of 4:04.19, and an 8k of 26:19.5.',
      ],
      bullets: [
        '**Favorite Memory:** ',
        '**Personal Shoutout:** ',
        '**Favorite Place:** ',
        '**Worst Memory:** ',
      ],
    },
  },
  {
    slug: 'skills',
    name: 'Skills & Certifications',
    color: '#f4bf47',
    size: 3.8,
    orbitRadius: 105,
    orbitSpeed: 0.026,
    initialAngle: 2.7,
    spinSpeed: 0.26,
    // icon: missing — no "skills" graphic supplied (placeholder disc for now)
    content: {
      title: 'Skills & Certifications',
      subtitle: '',
    },
    moons: [
      {
        slug: 'technical-skills',
        name: 'Technical Skills',
        color: '#ffe291',
        size: 1.2,
        orbitRadius: 6,
        orbitSpeed: 0.5,
        initialAngle: 0.5,
        icon: 'assets/planets/technical-skills.png',
        content: {
          title: 'Technical Skills',
          subtitle: 'Tools & platforms',
          bullets: [
            'Python — pandas, NumPy, TensorFlow',
            'Google Suite',
            'Microsoft Suite',
            'Claude & Claude Code',
          ],
        },
      },
      {
        slug: 'languages',
        name: 'Languages',
        color: '#eeb43a',
        size: 1.2,
        orbitRadius: 8,
        orbitSpeed: 0.42,
        initialAngle: 2.6,
        icon: 'assets/planets/languages.png',
        content: {
          title: 'Languages',
          subtitle: 'Spoken languages',
          bullets: ['English', 'Spanish'],
        },
      },
      {
        slug: 'certifications',
        name: 'Certifications',
        color: '#bd851f',
        size: 1.2,
        orbitRadius: 10,
        orbitSpeed: 0.34,
        initialAngle: 4.7,
        icon: 'assets/planets/certifications.svg',
        content: {
          title: 'Certifications',
          subtitle: 'Credentials',
          bullets: [
            'EMT (Emergency Medical Technician)',
            'Wilderness First Aid',
            'Spanish Translation & Interpretation for Kids in Need of Defense (K.I.N.D.)',
            'Claude 101',
            'AI Fluency',
            'ASA Bareboat Cruising',
          ],
        },
      },
    ],
  },
  {
    slug: 'finance',
    name: 'Finance',
    color: '#2e50c8',
    size: 4,
    orbitRadius: 118,
    orbitSpeed: 0.02,
    initialAngle: 4.0,
    spinSpeed: 0.18,
    icon: 'assets/planets/finance.jpg',
    content: {
      title: 'Finance',
      subtitle: 'March 2026–Present',
      body: [
        'I analyzed a simulated tech M&A deal for a security-compliance company, synthesizing ambiguous market, competitive, and growth data into a recommendation I presented live to Morgan Stanley bankers on the deal team.',
        'I was personally responsible for making the final call on whether or not to recommend the investment.',
        'I wanted to test this path out — and, having done so, I’ve decided not to pursue investment banking going forward.',
        'WSP (Wall Street Prep) Financial Accounting & Analysis certification.',
      ],
      bullets: [
        '**Favorite Memory:** ',
        '**Personal Shoutout:** ',
        '**Favorite Place:** ',
        '**Worst Memory:** ',
      ],
    },
  },
]
