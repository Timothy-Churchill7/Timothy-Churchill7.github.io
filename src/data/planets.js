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
// ORBIT ORDER (sun -> out): education, work, leadership, research, athletics,
// skills, finance. Radii below are kept compact so travel between them is quick.
//
// >>> CONTENT STATUS <<<
// Anything in [SQUARE BRACKETS] is a placeholder for a fact I couldn't know
// (dates, GPA, major, specific achievements) — fill those in. Everything else
// is safe to edit freely; the scene updates automatically.
// ---------------------------------------------------------------------------

export const PLANETS = [
  {
    slug: 'education',
    name: 'Education',
    color: '#4f8cff',
    size: 3.5,
    orbitRadius: 28,
    orbitSpeed: 0.11,
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
    slug: 'work',
    name: 'Work Experience',
    color: '#5ec8d8',
    size: 4.5,
    orbitRadius: 48,
    orbitSpeed: 0.075,
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
        size: 1.2,
        orbitRadius: 7,
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
        size: 1.2,
        orbitRadius: 9,
        orbitSpeed: 0.4,
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
        size: 1.2,
        orbitRadius: 11,
        orbitSpeed: 0.32,
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
      {
        slug: 'icode',
        name: 'iCode',
        color: '#a7dcc0',
        size: 1.2,
        orbitRadius: 13,
        orbitSpeed: 0.26,
        initialAngle: 2.3,
        content: {
          title: 'iCode',
          subtitle: '[role · dates]',
          body: 'Details coming soon.',
        },
      },
    ],
  },
  {
    slug: 'leadership',
    name: 'Leadership & Service',
    color: '#ff8f3f',
    size: 4.5,
    orbitRadius: 78,
    orbitSpeed: 0.05,
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
        size: 1.2,
        orbitRadius: 7,
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
        size: 1.2,
        orbitRadius: 9,
        orbitSpeed: 0.42,
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
        size: 1.2,
        orbitRadius: 11,
        orbitSpeed: 0.34,
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
      {
        // Re-parented from a standalone planet into Leadership & Service.
        // Content carried over unchanged.
        slug: 'emergency-medicine',
        name: 'Amherst College EMS / Med-13',
        color: '#ff5a52',
        size: 1.2,
        orbitRadius: 13,
        orbitSpeed: 0.28,
        initialAngle: 5.6,
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
    ],
  },
  {
    slug: 'research',
    name: 'Research',
    color: '#3fd6b0',
    size: 3,
    orbitRadius: 98,
    orbitSpeed: 0.04,
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
    slug: 'athletics',
    name: 'Athletics',
    color: '#a06bff',
    size: 3.5,
    orbitRadius: 110,
    orbitSpeed: 0.032,
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
    slug: 'skills',
    name: 'Skills & Certifications',
    color: '#ff6fb5',
    size: 3.8,
    orbitRadius: 126,
    orbitSpeed: 0.026,
    initialAngle: 2.7,
    spinSpeed: 0.26,
    content: {
      title: 'Skills & Certifications',
      subtitle: 'Select a moon to explore each group',
      body: 'The toolkit I bring to every project.',
    },
    moons: [
      {
        slug: 'technical-skills',
        name: 'Technical Skills',
        color: '#ff9ecd',
        size: 1.2,
        orbitRadius: 6.5,
        orbitSpeed: 0.5,
        initialAngle: 0.5,
        content: {
          title: 'Technical Skills',
          subtitle: 'Tools & platforms',
          bullets: [
            'Python — pandas, NumPy, TensorFlow',
            'Google Suite · Microsoft Suite',
            'TEM (transmission electron microscopy)',
            'Claude & Claude Code',
          ],
        },
      },
      {
        slug: 'languages',
        name: 'Languages',
        color: '#ffb8dd',
        size: 1.2,
        orbitRadius: 8.5,
        orbitSpeed: 0.4,
        initialAngle: 2.6,
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
        orbitRadius: 10.5,
        orbitSpeed: 0.32,
        initialAngle: 4.7,
        content: {
          title: 'Certifications',
          subtitle: 'Credentials',
          bullets: [
            'EMT (Emergency Medical Technician)',
            'Wilderness First Aid',
            'Spanish Translation & Interpretation (K.I.N.D.)',
            'Claude 101 · AI Fluency',
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
    orbitRadius: 142,
    orbitSpeed: 0.02,
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
]
