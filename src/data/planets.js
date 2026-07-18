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
          heading: 'Amherst College Class of \'29 — B.S. Mathematics & Chemistry',
          body: [
            'To me, Amherst represented a chance to explore a wide variety of interests in a place that puts community above all else and has a culture not just of doing well, but of doing good.',
            'Amherst also appealed to me athletically because being able to run as part of a Division III program lets me compete at a high level without sacrificing the things that are most important to me in my college experience: academic rigor and excitement, community involvement, and having the time to relax and enjoy my college experience.',
            'So far, I have a 3.9/4.0 GPA and my favorite classes have been The Cinema of Pedro Almodóvar (Spanish) and Groups, Rings, and Fields (Math).',
            'I have loved my college experience up to this point and I am so grateful to all my friends and professors that have made it what it is so far.',

          ],
          bullets: [
            '**Favorite Memory:** Spending an hour trying to convince the rest of my Spanish class that the kidnapper in *Átame* was the good guy',
            '**Personal Shoutout:** Professor Sanchez-Eppler taught my seminar, and inspired confidence and a desire for reflection on our families and experience with language',
            '**Favorite Building:** Beneski Museum or The Cage',
            ],
        },
        {
          heading: 'Noble and Greenough School Class of \'24',
          body: ['Nobles was an amazing place to go to high school: I was academically inspired and challenged, curiosity was encouraged and rewarded, and my teachers were passionate and  truly cared about me as a student and as a person.',
            'The community was strong, and I had the chance to contribute to welcoming the next wave of kids as an elected captain of cross country, skiing, and track, and through my engagement with the Mental Health Club and other communities on campus.',
          'I graduated Nobles with a 10.9/11 GPA earning Highest Academic Distinction. My favorite classes were Advanced Topics in Mathematics, Biochemistry Research, and Artificial Intelligence.',
                ],
          bullets: [
            '**Favorite Memory:** Endless games of spikeball in between classes and after lunch',
            '**Personal Shoutout:** Señor Mr. Profe Coach Ulrich was my teacher, my coach, and my advisor through it all - carpe diem',
            '**Favorite Building:** The Castle',
            '**Best Meal:** Deconstructed Shepherd\'s Pie',
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
                '**Worst Memory:** Food poisoning on the 100º, 12 hour night bus from Lake Titicaca to Puerto Maldonado',
                '**Favorite Quechua Word:** Tuyusiki',
              ],
            },
            {
              heading: 'Winter',
              body: ['After spending less than 72 hours at home, I set out to start my job working as a busser at the Goldminer\'s Daughter lodge in Alta, Utah. That Winter I skied more than 100 days but refrained from learning to backflip as per my mother\'s request.',
                'I learned how to live and operate completely on my own and show up for something with accountability and consistency, and how to properly ski powder, after being raised on the East Coast.',
              ],
              bullets: [
                '**Favorite Memory:** Showing up to work early to fold hundreds of origami napkin hearts for Valentine\'s Day',
                '**Personal Shoutout:** My fellow bussers, Lara and Diana',
                '**Favorite Trail:** High Traverse --> Garbage Chute --> North Rustler',
                '**Biggest Wipeout:** Attempting to send a cliff in Supreme Bowl, double ejecting and rolling 50 feet down the mountain',
              ],
            },
            {
              heading: 'Spring',
              body: ['In April I set off with a friend to drive across the country to see how much of the American West we could see in a month. We ended up covering some 7,000 miles across 13 national parks and every major city on the way.',
                    'We learned how to sleep in a car, how to budget and shop and drive for 12 hours straight, and how to navigate the endlessly confusing NPS reservation system. We saw friends and family along the way and made more wherever we went. ',
                  ],
              bullets: [
                '**Favorite Memory:** Summiting Cloud\'s Rest in Yosemite and seeing the Valley unfold endlessly in every direction',
                '**Personal Shoutout:** Lili, my travel partner',
                '**Favorite Place:** Little Yosemite Valley',
                '**Worst Memory:** Hitting a deer in a raging rainstorm on the first day of the trip',
              ],
            },
            {
              heading: 'Summer',
              body: ['My Summer was slower. I spent my days training for the Amherst XC tryout process in the fall and spending time with my family after being away for so long.',
                    'After seeing the immigration enforcement campaign on the news, this is when I began working with an immigration attorney doing interpretation/translation work to help her communicate with non-English speaking clients.',],
              bullets: [
                '**Favorite Memory:** Taking a sailboat out in a hurricane with my dad and uncle',
                '**Personal Shoutout:** My family',
                '**Favorite Game:** Bananagrams',
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
      subtitle: 'See Moons for more details',
      body: 'The jobs I’ve had have ranged from being a rowdy camp counselor charged with bringing excitement and energy to the day to a professional, polished restaurant staff at a luxury ski resort. I can manage a full stack deployment of a company site just as well as a pile of 7 year olds climbing on me like a jungle gym. Whatever it is I’m doing, though, I always make sure to bring good humor and energy. I’m a quick learner and I am excited to try new things, meet new people, and learn how to make more of an impact than I ever thought possible.',
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
          body: ['My first time working with software in a professional setting was working with Webflow for 23cubed. I started by polishing and implementing Content Management Systems (CMS) on outdated client pages but was quickly switched to working on current projects.',
          'Near the end of the summer, I took ownership of a complete full-stack redeployment of the company site (23cubed.com). I implemented our own Content Management System, redrew the home page, and drew up a new \'plugins\' page from scratch.',
          ],
          bullets: [
            '**Favorite Memory:** Being "almost done" with the plugins page for more than a week',
            '**Personal Shoutout:** My Boss, Ben, who trusted me immediately with responsibility and continued to put more faith in me as the summer progressed',
            '**Favorite Place:** My desk, from the hours of 11PM - 2AM',
            '**Favorite Feature to Code:** The zoom effect on the bottom middle panel of each Project display',
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
          body: ['As a Swing Counselor at the Nobles Day Camp, I had a new group of twenty kids almost every day. That meant twenty new personalities, preferences, allergies, fears, and catch phrases. I was a personal jungle gym for some kids and a cry zone for others. Some kids thought I was the greatest being to ever exist, and some thought I was the devil incarnate.',
          'Regardless of their attitudes, I had a lot of fun connecting with each and every kid I got the chance to. I was recognized for my leadership, adaptability, and relentless positive energy across all age groups with the "You\'re a Hoot" award (given to 3/160 counselors).'],
          bullets: [
            '**Favorite Memory:** When one of my former kids recognized me from across the lawn and broke away from his supervisors to run all the way over and give me a hug',
            '**Personal Shoutout:** Matthew, Angel, Carolyn and the rest of the 2D gang',
            '**Favorite Activity:** Dodgeball (but only when the kids let me play, too)',
            '**Most Humbling Memory:** Being taunted by a 2nd grader while bleeding profusely on the way to the Health Office after scraping my nose on the bottom of the pool',
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
          body: 'Working at Goldminer\'s was my first full time, proper job experience. I was by far the youngest in the restaurant, and I tried to bring energy and positivity every morning. The other two bussers were both J1 Visa holders from South America, and they helped me practice my Spanish and introduced me to Argentinian Rock music.'
            ,
          bullets: [
            '**Favorite Memory:** Blasting "La Morena" by Oro Solido while wiping down the tables after the last guests left',
            '**Personal Shoutout:** Lara and Diana',
            '**Favorite Special Leftovers:** Short Ribs and Mashed Potatoes',
            '**Worst Customer Experience:** Someone insisting on a "3 minute" boiled egg and then raging at me when it was basically still raw (duh)',
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
          body: 'Working at iCode was my first time having a job. It was an introduction to responsibility and accountability. I learned how to earn respect from the campers without sacrificing their trust and their ability to share their joy with me.',
          bullets: [
            '**Favorite Memory:** Organizing a soccer game that went way over break time',
            '**Favorite Place:** The park down the street where we went after lunch',
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
      body: 'The summer after my freshman year of high school, I went on a life changing backpacking trip. I carried with me a love for the outdoors and an appreciation for mental health resources I had access to, that not everyone does. Since then, my service work has been defined by two themes: working to connect people (friends, family, strangers) to the outdoors and provide them with physical and mental health support. I’ve learned how and when to lend a kind ear and I’ve seen people transform over three days in the forest. I’ve served my Amherst community as an EMT and helped people cross a language barrier to communicate their stress, their desires, and their life stories for their asylum cases.',
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
          body: ['Serving on AAS as part of student government has been one of the most rewarding parts of my Amherst experience. It allows me to make my voice heard to advocate for what I believe in.',
                'As a senator, I was elected to 4 committees: Student Council, The Appointments Board, Sustainability (chair), and The Mental Health Committee. These allow me to have a heavier role in school affairs within these specific categories.',
                'Being part of AAS also gives us the ability to host senate projects. These are opportunities to engage with the community and bring a fun spirit to campus. My two projects were Snow Your Senator: a day of snowballs and candy in the middle of February, and a school wide spikeball tournament with a watermelon for the winner.',
              ],
          bullets: [
            '**Favorite Memory:** Getting nailed in the back of the head by a stranger during my Snow Your Senator project (then asked for candy)',
            '**Personal Shoutout:** President Shane \'26',
            '**Favorite Place:** The Red Room',
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
          subtitle: 'August 2023–May 2024, Jul 2026 - Present',
          body: ['Samaritans was my first real volunteer experience. I did my training over the summer and started answering the phone as the school year began. The combination of high pressure conversations and an inevitable reminder of my own experiences made it simultaneously one of the most stressful and rewarding parts of my life, but after a year I had to step away.',
          'Years later, I am once again beginning refresher training to get back on the line as a completely different person, because every day I look around and feel grateful towards the people around me--something that not everyone has.',
          ],

          bullets: [
            '**Personal Shoutout:** The Callers and the Responders',
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
            'Backpacking is my favorite thing in the world. At first I followed other people into the wilderness and let them teach me how to enjoy the simplicity of doing nothing but walk. Eventually, I began to set off on my own.',
            'I’ve initiated, organized, and led backpacking trips across New Hampshire, Vermont, California, South Dakota, Utah, and Peru — planning food, Leave No Trace principles, water treatment, bear safety, budget, route, transportation, evacuation and emergency procedures, first aid, and reflection activities for group sizes ranging from 1 to 14. Two trips I’m especially proud of:',
            'A 3-day trip up to Glaciar Quelccaya in Peru — planned and led for 12 people, organized entirely in Spanish and bringing my group over 5000m of elevation.',
            'A 4-day trip into the Vermont woods just six weeks into college, bringing 13 other freshmen together to connect away from the chaos of campus.',
          ],
          bullets: [
            '**Favorite Memory:** Reading Cloud Cuckoo Land next to Hagerman\'s Lake on a layover day at HMI',
            '**Personal Shoutout:** Kayla, Michael, Sophie, and all my other trip leaders',
            '**Best View:** The Devil\'s Chair from White Canyon, UT',
            '**Favorite Meal:** Ramen Bombs',
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
          body: ['My ACEMS journey began with a 250 hour EMT course in 26 days over January of 2026. Since then, I\'ve been working roughly biweekly shifts and learning the difference between classroom knowledge and actual EMT work.',
                'I see ACEMS as a way for me to practice caring unconditionally, connect with the community, and improve my ability to stay composed and confident under pressure.',
          ],
          bullets: [
            '**Favorite Memory:** Mass Casualty Incident Drill',
            '**Personal Shoutout:** Scott',
            '**Favorite Skill:** Backboarding',
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
          body: ['As the Summer of 2025 progressed and the ICE crackdown intensified, I was horrified. As a naturalized U.S. Citizen I was safe, but I had friends from work and travel that weren\'t. I decided to contribute what I could. For me, that was my Spanish.',
            'I completed Spanish fluency testing and began to interpret live and on the phone for a local volunteer immigration attorney and her client. I also signed up to be an on-call document translator for court proceedings, which I have been doing since then.',
          ],
          bullets: [
            '**Personal Shoutout:** Celia',
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
        'The Olshansky Lab is an alternative energy research lab. We synthesize quantum dot particles and run photocatalysis experiments to improve the efficiency of artificial photosynthesis.',
        'The reason I joined was because of my love for the outdoors and my experience seeing it slowly collapse around us. I want to eventually pursue a career in alternative energy and climate change mitigation, and being involved with the science behind one of the ways we can tackle global warming is incredibly exciting.',
        'In addition to my normal research contribution, I wrote and deployed a holistic web-based data-visualization tool for TEM, UV-Vis, Emission, and Lifetime data using Claude Code',
      ],
      bullets: [
        '**Techniques and Instrumentation: TEM, UV-Vis, PL emission, Schlenk Line, Lifetime Measurement, Mass Spectrometry** ',
        '**Personal Shoutout:** Dr. Olshansky & Yurii',
        '**Favorite Place:** Hood 2 (not Hood 1)',
      ],
      links: [
        { label: 'Holistic Data Visualization Tool Plotter', url: 'https://spectra-plotter.onrender.com/' },
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
        'But I performed well enough at the tryouts to make it, and now I commit 20+ hours a week to ACXC. Being on the team has been a source of camaraderie, accountability, and spirit that has greatly enhanced my college experience so far.',
      ],
      bullets: [
        '**Favorite Memory:** The 4x800m at the 2026 NESCAC Championship',
        '**Personal Shoutout:** The Boix',
        '**Favorite Event:** The 800m',
        '**800m:** 1:53.89 (split)',
        '**1500m:** 4:04.19'
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
      subtitle: 'See Moons for more details',
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
            'Webflow',
            'Extensive Spectroscopy Techniques (see Research Planet)'

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
          subtitle: 'languages',
          bullets: ['English: Native', 'Spanish: Working Proficiency'],
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
            'Claude 101 & AI Fluency',
            'ASA Bareboat Cruising',
            'Wall Street Prep Accounting & Financial Statement Analysis'
          ],
        },
      },
    ],
  },
  {
    slug: 'finance',
    name: 'Finance',
    color: '#162f88',
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
        'It was a really exciting experience, and a really great way to test this path out. However, it\'s worth noting that I\'ve decided not to pursue investment banking going forward.',
      ],
      bullets: [
        '**Personal Shoutout:** Amal and the Make A Play Foundation',
      ],
    },
  },
]
