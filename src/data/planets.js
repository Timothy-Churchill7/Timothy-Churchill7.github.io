// ---------------------------------------------------------------------------
// PLANET DATA — the single source of truth for the whole system.
// ---------------------------------------------------------------------------
// Edit this file to add/remove planets or moons, retitle sections, recolor,
// or reposition orbits. The scene reads everything from here — you never need
// to touch the camera or rendering code to change content or layout.
//
// Field reference
// ---------------
//   slug         unique id; also the asset filename stem (see /public/assets/planets)
//   name         label shown floating by the planet
//   color        base planet color (hex)
//   size         planet radius (world units)
//   orbitRadius  distance of the planet's orbit from the sun
//   orbitSpeed   orbital angular speed (radians/sec) — smaller = slower
//   initialAngle starting position on the orbit (radians) so they don't line up
//   spinSpeed    how fast the planet rotates on its own axis (radians/sec)
//   moons[]      optional sub-items, each with its own mini-orbit:
//                { slug, name, color, size, orbitRadius, orbitSpeed, initialAngle }
//
//   content      resume detail shown in the info panel:
//                { title, subtitle, body?, bullets?: string[] }
//
// >>> CONTENT STATUS <<<
// Text below is a first pass drawn from the project brief. Anything in
// [SQUARE BRACKETS] is a placeholder for a fact I couldn't know (dates, GPA,
// major, specific achievements) — fill those in. Everything else is safe to
// edit freely; the scene updates automatically.
// ---------------------------------------------------------------------------

export const PLANETS = [
  {
    slug: 'education',
    name: 'Education',
    color: '#4f8cff',
    size: 5,
    orbitRadius: 58,
    orbitSpeed: 0.1,
    initialAngle: 0.4,
    spinSpeed: 0.25,
    content: {
      title: 'Education',
      subtitle: 'Amherst College · Class of [20XX]',
      body: 'Where it all started — my academic foundation.',
      bullets: [
        'Amherst College — B.A. in [major/minor], GPA [X.XX]',
        'Honors & awards: [Dean’s List / honors / scholarships]',
        'Relevant coursework: [key courses]',
        'Noble & Greenough School (Dedham, MA) — graduated [year]',
      ],
    },
  },
  {
    slug: 'research',
    name: 'Research',
    color: '#3fd6b0',
    size: 4.5,
    orbitRadius: 92,
    orbitSpeed: 0.08,
    initialAngle: 2.1,
    spinSpeed: 0.3,
    content: {
      title: 'Research',
      subtitle: 'Olshansky Chemistry Lab · Amherst College · [dates]',
      body: 'Quantum dot synthesis and scientific data visualization.',
      bullets: [
        'Synthesized and characterized quantum dots [methods/materials]',
        'Built a data-visualization tool to [purpose — e.g. analyze spectra / plot results]',
        'Skills: [instrumentation, Python/analysis, lab techniques]',
        'Outcome: [poster, publication, or key finding]',
      ],
    },
  },
  {
    slug: 'finance',
    name: 'Finance',
    color: '#f5b731',
    size: 6,
    orbitRadius: 132,
    orbitSpeed: 0.064,
    initialAngle: 4.0,
    spinSpeed: 0.18,
    content: {
      title: 'Finance',
      subtitle: 'Morgan Stanley · MAP Investment Banking Fellowship · [year]',
      body: 'Selective investment banking fellowship through Morgan Stanley’s MAP program.',
      bullets: [
        'Selected for the Morgan Stanley MAP (Multicultural / Access) IB Fellowship',
        'Exposure to [deal work / valuation / financial modeling]',
        'Mentorship and training with [group / desk]',
      ],
    },
  },
  {
    slug: 'emergency-medicine',
    name: 'Emergency Medicine',
    color: '#ff5a52',
    size: 4,
    orbitRadius: 176,
    orbitSpeed: 0.052,
    initialAngle: 1.2,
    spinSpeed: 0.28,
    content: {
      title: 'Emergency Medicine',
      subtitle: 'Amherst College EMS · Med-13 · [dates]',
      body: 'Student emergency medical services on campus.',
      bullets: [
        'EMT with Amherst College EMS, call sign Med-13',
        'Responded to [# / type] of campus medical emergencies',
        'Provided patient assessment, care, and handoff to [transport/hospital]',
        'Certified EMT (see Skills & Certifications)',
      ],
    },
  },
  {
    slug: 'athletics',
    name: 'Athletics',
    color: '#a06bff',
    size: 5.5,
    orbitRadius: 226,
    orbitSpeed: 0.042,
    initialAngle: 5.3,
    spinSpeed: 0.22,
    content: {
      title: 'Athletics',
      subtitle: 'Amherst Cross Country & Track and Field · NCAA Division III',
      body: 'Varsity distance runner.',
      bullets: [
        'Amherst College Cross Country and Track & Field (NCAA D3)',
        'Events: [XC 8k / 5k / 10k / etc.]',
        'Highlights: [PRs, all-conference, championship appearances]',
        'Balancing D3 athletics with a full academic load',
      ],
    },
  },
  {
    slug: 'leadership',
    name: 'Leadership & Service',
    color: '#ff8f3f',
    size: 7,
    orbitRadius: 288,
    orbitSpeed: 0.033,
    initialAngle: 3.1,
    spinSpeed: 0.16,
    content: {
      title: 'Leadership & Service',
      subtitle: 'Select a moon to explore each role',
      body: 'Roles where I led teams and served the community.',
    },
    moons: [
      {
        slug: 'aas-senator',
        name: 'AAS Senator',
        color: '#ffd27a',
        size: 1.4,
        orbitRadius: 13,
        orbitSpeed: 0.55,
        initialAngle: 0,
        content: {
          title: 'AAS Senator',
          subtitle: 'Association of Amherst Students · [dates]',
          body: 'Elected student government representative.',
          bullets: [
            'Elected to represent [constituency] in the student senate',
            'Served on [committee(s)] working on [initiatives]',
            'Advocated for [causes / budget / policy]',
          ],
        },
      },
      {
        slug: 'samaritans',
        name: 'Samaritans Helpline',
        color: '#ffb0a0',
        size: 1.4,
        orbitRadius: 18,
        orbitSpeed: 0.4,
        initialAngle: 2.0,
        content: {
          title: 'Samaritans Helpline Volunteer',
          subtitle: 'Crisis support · [dates]',
          body: 'Trained volunteer providing confidential emotional support.',
          bullets: [
            'Completed [#]-hour crisis-line training',
            'Provided confidential, non-judgmental support to callers in distress',
            'Practiced active listening and de-escalation',
          ],
        },
      },
      {
        slug: 'backpacking',
        name: 'Backpacking Trip Leader',
        color: '#c7e08a',
        size: 1.4,
        orbitRadius: 23,
        orbitSpeed: 0.3,
        initialAngle: 4.2,
        content: {
          title: 'Backpacking Trip Leader',
          subtitle: 'Outdoor leadership · [program/dates]',
          body: 'Led wilderness backpacking trips.',
          bullets: [
            'Led groups of [#] on multi-day backpacking trips',
            'Responsible for safety, navigation, and group dynamics',
            'Wilderness First Aid certified (see Skills & Certifications)',
          ],
        },
      },
    ],
  },
  {
    slug: 'work',
    name: 'Work Experience',
    color: '#5ec8d8',
    size: 6.5,
    orbitRadius: 352,
    orbitSpeed: 0.026,
    initialAngle: 0.9,
    spinSpeed: 0.15,
    content: {
      title: 'Work Experience',
      subtitle: 'Select a moon to explore each role',
      body: 'Jobs and internships across software, camps, and hospitality.',
    },
    moons: [
      {
        slug: '23-cubed',
        name: '23 Cubed',
        color: '#9fe3ee',
        size: 1.5,
        orbitRadius: 12.5,
        orbitSpeed: 0.5,
        initialAngle: 1.0,
        content: {
          title: '23 Cubed — Junior Developer',
          subtitle: 'Software development · [dates]',
          body: 'Junior developer building [product/area].',
          bullets: [
            'Developed [features/components] using [tech stack]',
            'Collaborated with [team] on [project]',
            'Shipped [outcome / impact]',
          ],
        },
      },
      {
        slug: 'nobles-day-camp',
        name: 'Nobles Day Camp',
        color: '#8fd6c4',
        size: 1.5,
        orbitRadius: 17,
        orbitSpeed: 0.38,
        initialAngle: 3.4,
        content: {
          title: 'Nobles Day Camp — Counselor',
          subtitle: 'Summer [year(s)]',
          body: 'Summer camp counselor.',
          bullets: [
            'Supervised and mentored [age group] campers',
            'Planned and ran daily activities',
            'Ensured camper safety and engagement',
          ],
        },
      },
      {
        slug: 'goldminers-daughter',
        name: "Goldminer's Daughter",
        color: '#bfe0a8',
        size: 1.5,
        orbitRadius: 22,
        orbitSpeed: 0.28,
        initialAngle: 5.5,
        content: {
          title: "Goldminer's Daughter Lodge — Server",
          subtitle: 'Alta, UT · [season/year]',
          body: 'Server at a ski-resort lodge.',
          bullets: [
            'Provided fast-paced food & beverage service in a high-volume lodge',
            'Worked as part of a tight-knit seasonal team',
            'Delivered strong guest experience in a resort setting',
          ],
        },
      },
    ],
  },
  {
    slug: 'skills',
    name: 'Skills & Certifications',
    color: '#ff6fb5',
    size: 4.5,
    orbitRadius: 418,
    orbitSpeed: 0.02,
    initialAngle: 2.7,
    spinSpeed: 0.26,
    content: {
      title: 'Skills & Certifications',
      subtitle: 'Technical · Languages · Certifications',
      body: 'The toolkit I bring to every project.',
      bullets: [
        'Programming & ML: Python, [NumPy / pandas / scikit-learn / PyTorch], [other langs]',
        'AI tooling: fluent with Claude and Claude Code',
        'Languages: [language — proficiency], [language — proficiency]',
        'Certifications: EMT · Wilderness First Aid · [translation certification]',
      ],
    },
  },
]
