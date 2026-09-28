// ---------------------------------------------------------------------------
// ABOUT ME — content for the panel that opens when you click the sun.
// ---------------------------------------------------------------------------
// This is NOT a resume section; it's a personal note to the visitor. Rendered
// through the same InfoPanel as everything else, using the `sections` field.
// ---------------------------------------------------------------------------

export const ABOUT_ME = {
  kind: 'sun',
  slug: 'about',
  size: 10, // matches SUN_RADIUS — used to frame the fly-to vantage
  color: '#ffcf59',
  icon: 'assets/tim_headshot.jpg',
  content: {
    title: 'About Me',
    subtitle: 'Tim Churchill',
    subtitleUrl: 'https://www.linkedin.com/in/timothychurchill-/',
    sections: [
      {
        heading: 'Hobbies & Interests',
        bullets: [
          'Running & Backpacking',
          'Listening to music',
          'Playing board games, card games, and bananagrams',
          'Reading',
        ],
      },
      {
        heading: 'AI acknowledgment',
        body: 'This site was made possible by Claude Code',
      },
    ],
  },
}
