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
          'Running & Backpacking in the woods',
          'Playing Bananagrams with my family',
          'Reading. My three favorite books are Cloud Cuckoo Land, Tuesdays with Morrie, and Harry Potter and the Chamber of Secrets — and I’m currently reading Anxious People by Fredrik Backman',
        ],
      },
      {
        heading: 'About This Site',
        body: 'Five summers ago I decided I wanted a 3D, interactive personal website, so I loaded up Stack Overflow and did my best to wrangle Three.js into something coherent, learning raycasting, camera controls, and textures along the way. I got a cool site working, but struggled to get the right packages loading and rendering properly once deployed to GitHub Pages. As my resume developed further, I left the site behind. Now, with Claude Code, I have the ability to reinstate it and shape its feel with much more precision and creative liberty.',
      },
    ],
  },
}
