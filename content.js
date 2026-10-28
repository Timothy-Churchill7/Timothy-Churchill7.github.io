// ===========================================================================
// content.js — ALL copy, links, projects and field lines for the site.
//
// Edit anything here, then bake it into the static HTML with:
//
//     node scripts/render.mjs
//
// THE RULE FOR THIS FILE: any text longer than five words is either verbatim
// from the solar-system site (solarSystem/src/data/planets.js and about.js),
// verbatim from Tim's writing samples (field lines only), or a BLANK run
// for Tim to fill. Nothing longer than five words is machine-written.
// Every BLANK is marked TODO(tim) — grep for it.
// ===========================================================================

// placeholder for text Tim will write himself
const BLANK = (n) => Array(n).fill("BLANK").join(" ");

export const site = {
  name: "Tim Churchill",
  first: "Tim",
  description: "Amherst College '29", // TODO(tim): one-line description for search results and link previews
  tagline: "AMHERST COLLEGE '29", // TODO(tim): the one line under "Hi, I'm Tim" on the home page
  url: "https://timchurchill.com/", // TODO(tim): full https URL once deployed, e.g. "https://timchurchill.com/site/" (see README › Deploy)
  year: 2026,
};

export const links = {
  email: "tchurchill29@amherst.edu",
  github: "https://github.com/Timothy-Churchill7",
  linkedin: "https://www.linkedin.com/in/timothychurchill-/", // from about.js
  solar: "/3d/", // the solar-system site, built into this site's 3d/ folder (npm run build:3d)
  solarLabel: "go 3-D",
};

// Quotations Tim chose. Wording checked against Goodreads
// (goodreads.com/quotes/7727986), which matches the book text he supplied.
export const quotes = [
  {
    author: "Robert M. Pirsig",
    work: "Zen and the Art of Motorcycle Maintenance",
    text: "Mountains should be climbed with as little effort as possible and without desire. The reality of your own nature should determine the speed. If you become restless, speed up. If you become winded, slow down. You climb the mountain in an equilibrium between restlessness and exhaustion. Then, when you’re no longer thinking ahead, each footstep isn’t just a means to an end but a unique event in itself. This leaf has jagged edges. This rock looks loose. From this place the snow is less visible, even though closer. These are things you should notice anyway. To live only for some future goal is shallow. It’s the sides of the mountain which sustain life, not the top. Here’s where things grow.",
  },
  {
    // Morrie to Ted Koppel; Goodreads: goodreads.com/work/quotes/1995335-tuesdays-with-morrie?page=9
    author: "Mitch Albom",
    work: "Tuesdays with Morrie",
    text: "I'm too ugly to be a narcissist.",
  },
  {
    // four separate passages, each checked on Goodreads; the last is the opening of a longer line
    author: "Anthony Doerr",
    work: "Cloud Cuckoo Land",
    text: "what's so beautiful about a fool is that a fool never knows when to give up … Stranger, whoever you are, open this to learn what will amaze you. … “Sometimes,” he says, “when I feel like working, I just sit and wait for the feeling to pass,” … There is magic in this place",
  },
  {
    // final stanza; Goodreads matches word for word
    author: "Robert Frost",
    work: "Stopping by Woods on a Snowy Evening",
    text: "The woods are lovely, dark and deep,\nBut I have promises to keep,\nAnd miles to go before I sleep,\nAnd miles to go before I sleep.",
  },
];
const PIRSIG = { author: quotes[0].author, work: quotes[0].work };
const ALBOM = { author: quotes[1].author, work: quotes[1].work };
const DOERR = { author: quotes[2].author, work: quotes[2].work };
const FROST = { author: quotes[3].author, work: quotes[3].work };

// Page headers. Kickers are chrome; intros run the typing effect.
export const pages = {
  home: { chip: "see more" },
  // quiet: a small lowercase label instead of the giant title
  work: { kicker: "", title: "professional", quiet: true}, // TODO(tim): work page intro sentence
  offTrack: { kicker: "02 / off-track", title: "Off-Track", intro: "other stuff I do" },
  contact: { kicker: "03 / contact", title: "Contact" },
  notFound: { kicker: "404", title: "Nothing here.", link: "back home" },
};

// Each project: { id, media, title, tagline, role, org, dates, status, summary, body: [p, p], links: [{label, url}] }
// media names a background engine in js/work-map.js: "decay" | "ecg" | "tape" | "cubes" | "spectra" | "orrery" | null (black field).
// The orbit period is 21 s × projects.length, so adding or removing one here just works.
// summary is optional; when set it becomes the ring node's tooltip.
// All body text is verbatim from planets.js.
export const projects = [
  {
    id: "olshansky",
    media: "decay",
    title: "Olshansky Lab",
    role: "Undergraduate researcher",
    org: "Amherst College",
    dates: "June 2026–Present",
    status: "ongoing",
    summary: "",
    body: [
      "We synthesize quantum dot particles and run photocatalysis experiments to improve the efficiency of artificial photosynthesis.",
      "The reason I joined was because of my love for the outdoors and my experience seeing it slowly collapse around us. I want to eventually pursue a career in alternative energy and climate change mitigation, and being involved with the science behind one of the ways we can tackle global warming is incredibly exciting.",
      // the Spectra Plotter (final period added)
      "In addition to my normal research contribution, I wrote and deployed a holistic web-based data-visualization tool for TEM, UV-Vis, Emission, and Lifetime data using Claude Code.",
    ],
    links: [
      { label: "spectra plotter", url: "https://spectra-plotter.onrender.com/" },
      { label: "plotter source", url: "https://github.com/Timothy-Churchill7/spectra_plotter" },
      { label: "TEM dot analyzer", url: "https://github.com/Timothy-Churchill7/TEM_dots_analyzer" }, // TODO(tim): confirm you want this repo linked
    ],
  },
  {
    id: "acems",
    media: "ecg",
    title: "Amherst College EMS",
    role: "EMT",
    org: "ACEMS",
    dates: "January 2026–Present",
    status: "ongoing",
    summary: "",
    body: [
      // planets.js › leadership › emergency-medicine
      "My ACEMS journey began with a 250 hour EMT course in 26 days over January of 2026. Since then, I've been working roughly biweekly shifts and learning the difference between classroom knowledge and actual EMT work.",
      "I see ACEMS as a way for me to practice caring unconditionally, connect with the community, and improve my ability to stay composed and confident under pressure.",
    ],
    links: [],
  },
  {
    id: "deal",
    media: "tape",
    title: "Tech M&A case",
    role: "Analyst",
    org: "Make A Play Foundation",
    dates: "March–July 2026",
    status: "presented",
    summary: "",
    body: [
      // planets.js › finance (the "not pursuing investment banking" paragraph is left out, per the framing you chose)
      "I analyzed a simulated tech M&A deal for a security-compliance company, synthesizing ambiguous market, competitive, and growth data into a recommendation I presented live to Morgan Stanley bankers on the deal team.",
      "I was personally responsible for making the final call on whether or not to recommend the investment.",
    ],
    links: [],
  },
  {
    id: "23cubed",
    media: "cubes",
    title: "23Cubed",
    role: "Junior Developer",
    org: "",
    dates: "June–August 2022",
    status: "complete",
    summary: "",
    body: [
      // planets.js › work › 23-cubed
      "My first time working with software in a professional setting was working with Webflow for 23cubed. I started by polishing and implementing Content Management Systems (CMS) on outdated client pages but was quickly switched to working on current projects.",
      "Near the end of the summer, I took ownership of a complete full-stack redeployment of the company site (23cubed.com). I implemented our own Content Management System, redrew the home page, and made a new 'plugins' page from scratch.",
    ],
    links: [{ label: "23cubed.com", url: "https://23cubed.com" }],
  },
];

// Ruled list on the Off-Track page (off-track/index.html). Tim's own words (listed in tests/your-words.json).
export const offTrack = [
  { label: "Running", text: "I walked on to Amherst's XC and T&F teams as an 800m specialist (1:53.9). I love it."},
  
  { label: "Backpacking", text: "My favorite thing in the world is walking and living out of a bag. Mountains > Beach." },
  { label: "Samaritans", text: "Volunteering on the Samaritans Suicide and Crisis Lifeline." },
  { label: "Mr. Gad's House of Improv", text: "I spend six hours a week making a fool of myself with friends." },
  { label: "Spanish", text: "I speak Spanish and do asynchronous volunteer legal translation work." },
  { label: "Skiing", text: "I grew up skiing and racing, and spent 100 days on snow in the winter of 2024-25 working at Alta, UT." },
];

export const contact = {
  intro: "Reach out about anything.",
  meta: [
    { k: "home", v: "Wellesley, MA" },
    { k: "education", v: "Amherst College" },
    { k: "lang", v: "english · español" },
  ],
};

// The live field's sentences. Plain strings are verbatim from the writing samples
// in ../Writing Samples; objects are cited quotations (text must come from `quotes`).
// Kept general: life, meaning, mood, not specific episodes.
// TODO(tim): add, cut or swap lines; keep each ≤ ~110 characters.
export const fieldLines = [
  // Common App, SURF statement
  "In unspoken agreement we witness the daylight drain from the valley and the Milky Way unfurl overhead.",
  "Now, when I backpack, I’m a smudge in the vast forests of whatever mountains I find myself in.",
  "And when I focus fully on what is in front of me, I become curious about it.",
  "Now, curiosity defines how I interact with the world.",
  // Claude Corps essays, ACEMS application
  "I realized that there was something I could contribute.",
  "It's the kind of place where people genuinely want to see each other thrive.",
  // FYSE writing, capstone draft
  "But standing out and being unwelcome are two very distinct experiences.",
  "My difference was just that: difference.",
  "These small moments define a community: who belongs and who doesn't, who is valued, and who is unwelcome.",
  "Nuance and novelty incite conversation, disagreement, passion and love.",
  "Recall: plurality precedes richness.",
  "In Spanish, nobody dies forever.",
  // capstone essay ("Richness in Plurality"), more lines; two are clauses cut from longer sentences
  "Without these joys, what is the point of life at all?",
  "Only a plethora of pluralities can guarantee the preservation of any one identity.",
  "American plurality is beautiful.",
  "In this way they live on, waiting to return again in November.",
  "Change, then, is built into the structure of the language and comes not as a disruption but as a constant.",
  "Hopi sees time as a continuously flowing river and actions like taking a swim.",
  "I do not feel hopeless. I do not feel pessimistic. Just frustrated.",
  "I still believe in the power of a story",
  "In the lonely cold, human beings can submit to the temptation to hate the other.",
  "Cultural equality through joyful plurality is an attempt to dissolve the center and bring home the lost ones.",
  "When no one language is singularly American, all are equally American.",
  "Accepting the non-standard is insufficient.",
  "Ambivalence still exists, but mild opinions are falling out of fashion.",
  "The lie is comparatively small compared to the joy it facilitates.",
  "Of course, the intersection of identities is more complex than a simple hierarchy.",
  "For every situation, the balance of identities and their relative influences define a person’s state.",
  "I want my country to sound like this.",
  "Plurality.",
  // Modernist manifesto, journals, essay
  "In the forest you are without identity–simply another wanderer.",
  "What is math for if not to solve problems irrefutably?",
  "Identity is what makes us unique, what we cling on to when we don’t know who we are.",
  "Judgement places the blame on the individual, it seeks to categorize without understanding.",
  // a stanza from the Modernist manifesto poem; "\n" keeps its line breaks in the field
  "You walk in spirals, circles too\nFor you have nothing else to do\nIt might take minutes, hours, years\nUntil the forest’s done with you",
  "Five I count five perfect Coca leaves and a Sullu",
  // Pirsig, cited
  { text: "To live only for some future goal is shallow.", ...PIRSIG },
  { text: "It’s the sides of the mountain which sustain life, not the top. Here’s where things grow.", ...PIRSIG },
  // Albom, cited
  { text: "I'm too ugly to be a narcissist.", ...ALBOM },
  // Doerr, cited
  { text: "what's so beautiful about a fool is that a fool never knows when to give up", ...DOERR },
  { text: "Stranger, whoever you are, open this to learn what will amaze you.", ...DOERR },
  { text: "“Sometimes,” he says, “when I feel like working, I just sit and wait for the feeling to pass,”", ...DOERR },
  { text: "There is magic in this place", ...DOERR },
  // Frost, cited; "\n" keeps the stanza's line breaks
  { text: "The woods are lovely, dark and deep,\nBut I have promises to keep,\nAnd miles to go before I sleep,\nAnd miles to go before I sleep.", ...FROST },
  // TODO(tim): more lines from Tuesdays with Morrie (Mitch Albom) or Cloud Cuckoo Land (Anthony Doerr):
  // add the passage to that book's entry in `quotes` above, then a { text, ...ALBOM } / { text, ...DOERR } line here.
  // goodreads.com/work/quotes/1995335-tuesdays-with-morrie · goodreads.com/work/quotes/88757679-cloud-cuckoo-land
];

// Footers: the left side of every footer is the links.solarLabel link; the right is the © line.

export default { site, links, quotes, pages, projects, offTrack, contact, fieldLines };
