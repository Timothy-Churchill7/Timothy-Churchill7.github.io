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
//       body     string | string[]              flowing paragraph(s)
//       bullets  string[]                        bullet list
//       sections { heading, body?, bullets? }[]  sub-sections
//       links    { label, url }[]                outbound links
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
    color: '#5a9bff',
    size: 3.5,
    orbitRadius: 28,
    orbitSpeed: 0.11,
    initialAngle: 0.4,
    spinSpeed: 0.25,
    icon: 'assets/planets/education.jpg',
    content: {
      title: 'Education',
      subtitle: 'Amherst College · Noble & Greenough School',
      sections: [
        {
          heading: 'Amherst College — B.S. Mathematics & Chemistry',
          body: [
            'To me, Amherst represented a chance to explore a wide variety of interests in a place that puts community above all else and has a culture not just of doing well but of doing good.',
            'Amherst also appealed to me athletically because being able to run as part of a Division III program lets me compete at a high level without sacrificing the things that are most important to me in my college experience: academic rigor and excitement, community involvement, and having the time to relax and make forever memories.',
            'So far, I have a 3.9/4.0 GPA and my favorite classes have been The Cinema of Pedro Almodóvar and Groups, Rings, and Fields.',
            'I have loved my college experience up to this point and I am so grateful to all my friends and professors that have made my experience what it is so far.',

          ],
        },
        {
          heading: 'Noble and Greenough School',
          body: 'GPA 10.9/11 · National Merit Scholarship Finalist · 1580 SAT · Highest Academic Distinction. Three-time elected captain — skiing, cross country, and track & field. Relevant courses: Multivariable Calculus, Advanced Topics in Mathematics, Biochemistry Research, Artificial Intelligence.',
        },
      ],
    },
    moons: [
      {
        slug: 'gap-year',
        name: 'Gap Year',
        color: '#8fbaff',
        size: 1.2,
        orbitRadius: 5.5,
        orbitSpeed: 0.5,
        initialAngle: 1.0,
        icon: 'assets/planets/gap-year.jpg',
        content: {
          title: 'Gap Year',
          subtitle: 'A year of language, mountains, and miles · 2025',
          bullets: [
            'Where There Be Dragons — Andes & Amazon semester (Fall 2025): a 77-day program of full Spanish immersion, homestays, and travel across Bolivia and Peru, including a 3-day, fully self-planned backpacking trip up to 16,500 ft of elevation.',
            'Worked at The Goldminer’s Daughter Lodge in Alta, UT (see Work Experience for full detail).',
            'Took a 5-week, self-planned road trip from Salt Lake City through 13 national parks, ending in Boston.',
            'Began Spanish translation work for a local immigration attorney — the start of what became the K.I.N.D. translation work.',
          ],
        },
      },
    ],
  },
  {
    slug: 'work',
    name: 'Work Experience',
    color: '#5ec8d8',
    size: 4.5,
    orbitRadius: 52,
    orbitSpeed: 0.075,
    initialAngle: 0.9,
    spinSpeed: 0.15,
    // icon: missing — no "work" graphic supplied (placeholder disc for now)
    content: {
      title: 'Work Experience',
      subtitle: 'Select a moon to explore each role',
      body: 'The jobs I’ve had have ranged from being a rowdy camp counselor charged with bringing excitement and energy to the day to a professional, polished restaurant staff at a luxury ski resort. I can manage a full stack deployment of a company site just as well as a pile of 7 year olds climbing on me like a jungle gym. Whatever it is I’m doing, though, I always make sure to bring my personality: easy to laugh and smile but also ready to lend a hand or an ear when it’s needed. I’m a quick learner and I am excited to try new things, meet new people, and learn how to make more of an impact than I ever thought possible.',
    },
    moons: [
      {
        slug: '23-cubed',
        name: '23 Cubed',
        color: '#9fe3ee',
        size: 1.2,
        orbitRadius: 6.5,
        orbitSpeed: 0.5,
        initialAngle: 1.0,
        icon: 'assets/planets/23-cubed.png',
        content: {
          title: '23 Cubed — Junior Developer',
          subtitle: 'Jun–Aug 2022',
          body: 'I took ownership of a complete full-stack redeployment of the company site (23cubed.com), and developed and deployed four client websites using Webflow, JavaScript, CSS, and HTML.',
        },
      },
      {
        slug: 'nobles-day-camp',
        name: 'Nobles Day Camp',
        color: '#8fd6c4',
        size: 1.2,
        orbitRadius: 8.5,
        orbitSpeed: 0.42,
        initialAngle: 3.4,
        icon: 'assets/planets/nobles-day-camp.jpg',
        content: {
          title: 'Nobles Day Camp — Swing Counselor',
          subtitle: 'Jun–Aug 2024',
          body: 'I adapted daily to new camper groups ages 6–13, coordinating activities and building relationships through rapidly changing group dynamics. I earned the “You’re a Hoot” award as one of the top three counselors of the week (~top 2%), recognized for leadership, adaptability, and fostering positive camper engagement.',
        },
      },
      {
        slug: 'goldminers-daughter',
        name: "Goldminer's Daughter",
        color: '#bfe0a8',
        size: 1.2,
        orbitRadius: 10.5,
        orbitSpeed: 0.34,
        initialAngle: 5.5,
        icon: 'assets/planets/goldminers-daughter.png',
        content: {
          title: "The Goldminer's Daughter Lodge — Dining Room Server",
          subtitle: 'Dec 2024–Mar 2025 · Alta, UT',
          body: 'I served 50+ tables per shift in a high-volume luxury ski lodge, communicating in both English and Spanish in a fast-paced hospitality environment.',
        },
      },
      {
        slug: 'icode',
        name: 'iCode',
        color: '#a7dcc0',
        size: 1.2,
        orbitRadius: 12.5,
        orbitSpeed: 0.28,
        initialAngle: 2.3,
        icon: 'assets/planets/icode.jpeg',
        content: {
          title: 'iCode — Counselor',
          subtitle: 'Jun–Aug 2021',
          body: 'A coding and tech summer camp for kids; I was responsible for roughly 15 campers ages 7–12.',
        },
      },
    ],
  },
  {
    slug: 'leadership',
    name: 'Leadership & Service',
    color: '#ff8f3f',
    size: 4.5,
    orbitRadius: 84,
    orbitSpeed: 0.05,
    initialAngle: 3.1,
    spinSpeed: 0.16,
    // icon: missing — no "leadership" graphic supplied (placeholder disc for now)
    content: {
      title: 'Leadership & Service',
      subtitle: 'Select a moon to explore each role',
      body: 'My COVID tinted freshman year of high school was a time when I struggled with my mental health. Through a life changing backpacking trip and a strong support network, I had a much better time through the rest of high school. But I carried with me a love for the outdoors and an appreciation for the resources I had access to, that not everyone does. Since then, my service work has been defined by these two themes: working to connect people (friends, family, strangers) to the outdoors and provide them with physical and mental health support. I’ve learned how and when to lend a kind ear and I’ve seen people transform over three days in the forest. I’ve served my Amherst community as an EMT and helped people cross a language barrier to communicate their stress, their desires, and their life stories for their asylum cases.',
    },
    moons: [
      {
        slug: 'aas-senator',
        name: 'AAS Senator',
        color: '#ffd27a',
        size: 1.2,
        orbitRadius: 6,
        orbitSpeed: 0.55,
        initialAngle: 0,
        icon: 'assets/planets/aas-senator.webp',
        content: {
          title: 'AAS Senator',
          subtitle: 'Association of Amherst Students · Sep 2025–Present',
          body: 'Twice elected as one of 8 Senators; appointed to 4 committees, including the Committees for Mental Health and Sustainability.',
        },
      },
      {
        slug: 'samaritans',
        name: 'Samaritans Helpline',
        color: '#ffb0a0',
        size: 1.2,
        orbitRadius: 8,
        orbitSpeed: 0.44,
        initialAngle: 2.0,
        icon: 'assets/planets/samaritans.jpg',
        content: {
          title: 'Samaritans Crisis Services — Helpline Volunteer',
          subtitle: 'Aug 2023–May 2024',
          body: 'I completed 40+ hours of crisis-response training to staff weekly 3-hour helpline shifts. I assessed suicide risk and supported callers through 10–60+ minute conversations, making high-stakes decisions independently.',
        },
      },
      {
        slug: 'backpacking',
        name: 'Backpacking — Trip Leader',
        color: '#c7e08a',
        size: 1.2,
        orbitRadius: 10,
        orbitSpeed: 0.36,
        initialAngle: 4.2,
        icon: 'assets/planets/backpacking.avif',
        content: {
          title: 'Backpacking — Trip Leader',
          subtitle: 'Jul 2024–Present',
          body: 'I’ve initiated, organized, and led backpacking trips across New Hampshire, Vermont, California, South Dakota, Utah, and Peru — planning food, Leave No Trace principles, water treatment, budget, route, transportation, evacuation and emergency procedures, first aid, and reflection/improvement exercises for group sizes ranging from 1 to 14. Two trips I’m especially proud of:',
          bullets: [
            'A 3-day trip up to Glaciar Quelccaya in Peru — planned and led for 12 people, conducted entirely in Spanish, on a limited budget.',
            'A 4-day trip into the Vermont woods just two months into college — bringing 14 people (mostly backpacking newbies) together to connect and make friends at the very start of college.',
          ],
        },
      },
      {
        slug: 'emergency-medicine',
        name: 'Amherst College EMS / Med-13',
        color: '#ff6f68',
        size: 1.2,
        orbitRadius: 12,
        orbitSpeed: 0.3,
        initialAngle: 5.6,
        icon: 'assets/planets/emergency-medicine.webp',
        content: {
          title: 'Amherst College EMS (Med-13)',
          subtitle: 'Jan 2026–Present',
          body: 'I completed a 26-day EMT certification and deployed as a Med-13 responder, working 12-hour shifts responding to on-campus emergency calls beginning March 2026.',
        },
      },
      {
        slug: 'kind',
        name: 'K.I.N.D. Translation',
        color: '#ffc98a',
        size: 1.2,
        orbitRadius: 14,
        orbitSpeed: 0.24,
        initialAngle: 3.0,
        icon: 'assets/planets/kind.jpg',
        content: {
          title: 'Spanish Translation & Interpretation — K.I.N.D.',
          subtitle: 'Kids in Need of Defense · Jun 2025–Present',
          body: 'I completed Spanish fluency testing, interpreted live for an ongoing asylum case between an attorney and client, and continue to serve as an on-call legal document translator for immigration cases.',
        },
      },
    ],
  },
  {
    slug: 'research',
    name: 'Research',
    color: '#3fd6b0',
    size: 3,
    orbitRadius: 104,
    orbitSpeed: 0.04,
    initialAngle: 2.1,
    spinSpeed: 0.3,
    icon: 'assets/planets/research.png',
    content: {
      title: 'Research',
      subtitle: 'Olshansky Chemistry Lab · Undergraduate Researcher · Jun 2026–Present',
      body: [
        'I synthesize quantum dot particles and run photocatalysis experiments to improve the efficiency of artificial photosynthesis.',
        'This lab is where my hard computational and technical skills meet a love for the planet and a desire to contribute to the fight against climate change — sustainability is the "why" behind the work.',
        'Using Claude Code, I wrote and deployed a holistic web-based data-visualization tool for TEM, UV-Vis, Emission, and Lifetime data.',
      ],
      bullets: [
        'Techniques & instrumentation: TEM, UV-Vis, PL emission, Schlenk line technique, lifetime measurement, mass spectrometry.',
      ],
      links: [
        { label: 'Spectra Plotter — data-viz tool', url: 'https://spectra-plotter.onrender.com/' },
      ],
    },
  },
  {
    slug: 'athletics',
    name: 'Athletics',
    color: '#ff6b5b',
    size: 3.5,
    orbitRadius: 116,
    orbitSpeed: 0.032,
    initialAngle: 5.3,
    spinSpeed: 0.22,
    icon: 'assets/planets/athletics.png',
    content: {
      title: 'Athletics',
      subtitle: 'Amherst Cross Country & Track and Field · NCAA D3 · Sep 2025–Present',
      body: [
        'I walked on to Division III cross country and track & field after trying — and failing — to be recruited out of high school. Part of the motivation for taking a gap year was to keep developing as a runner and improve my odds of making the team.',
        'I commit 20+ hours a week as part of a New England D3 Championship and NESCAC Championship team.',
        'I’m an 800m specialist. Personal bests: an 800m split of 1:53.89, a 1500m of 4:04.19, and an 8k of 26:19.5.',
      ],
    },
  },
  {
    slug: 'skills',
    name: 'Skills & Certifications',
    color: '#ff6fb5',
    size: 3.8,
    orbitRadius: 132,
    orbitSpeed: 0.026,
    initialAngle: 2.7,
    spinSpeed: 0.26,
    // icon: missing — no "skills" graphic supplied (placeholder disc for now)
    content: {
      title: 'Skills & Certifications',
      subtitle: 'Select a moon to explore each group',
    },
    moons: [
      {
        slug: 'technical-skills',
        name: 'Technical Skills',
        color: '#ff9ecd',
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
        color: '#ffb8dd',
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
        color: '#ff86c2',
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
    color: '#f5b731',
    size: 4,
    orbitRadius: 148,
    orbitSpeed: 0.02,
    initialAngle: 4.0,
    spinSpeed: 0.18,
    icon: 'assets/planets/finance.jpg',
    content: {
      title: 'Finance',
      subtitle: 'Morgan Stanley · MAP Investment Banking Fellow · Mar 2026–Present',
      body: [
        'I analyzed a simulated tech M&A deal for a security-compliance company, synthesizing ambiguous market, competitive, and growth data into a recommendation I presented live to Morgan Stanley bankers on the deal team.',
        'I was personally responsible for making the final call on whether or not to recommend the investment.',
        'I wanted to test this path out — and, having done so, I’ve decided not to pursue investment banking going forward.',
      ],
      bullets: [
        'WSP (Wall Street Prep) Financial Accounting & Analysis certification.',
      ],
    },
  },
]
