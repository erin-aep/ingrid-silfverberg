export const disciplines = [
  "Motion Design",
  "Branding",
  "Filmmaking",
  "UI / UX",
  "Marketing",
] as const;

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
] as const;

export type WorkCategory =
  | "All"
  | "Motion"
  | "Branding"
  | "Film"
  | "UI / UX"
  | "Marketing";

export const workFilters: WorkCategory[] = [
  "All",
  "Motion",
  "Branding",
  "Film",
  "UI / UX",
  "Marketing",
];

export type WorkItem = {
  id: string;
  title: string;
  tags: string;
  categories: Exclude<WorkCategory, "All">[];
  award?: boolean;
  awardNote?: string;
  layout: "tall" | "medium" | "small" | "wide";
  theme: 1 | 2 | 3 | 4 | 5;
  vimeoEmbed?: string;
  href?: string;
};

export const workItems: WorkItem[] = [
  // Motion
  {
    id: "saas-product-demo",
    title: "SaaS Product Demo",
    tags: "Motion · 2026",
    categories: ["Motion"],
    layout: "medium",
    theme: 1,
  },
  {
    id: "motion-animation-reel-2025",
    title: "Motion Design & Animation Show Reel",
    tags: "Motion · 2025",
    categories: ["Motion"],
    layout: "wide",
    theme: 2,
  },
  {
    id: "logo-animations",
    title: "Logo Animations",
    tags: "Motion · 2024",
    categories: ["Motion"],
    layout: "medium",
    theme: 3,
  },
  {
    id: "motion-reel-2023",
    title: "Motion Design Show Reel",
    tags: "Motion · 2023",
    categories: ["Motion"],
    layout: "wide",
    theme: 4,
    vimeoEmbed: "https://player.vimeo.com/video/908238559",
  },
  // Branding
  {
    id: "pamulak",
    title: "Pamulak National Arts Month Celebration",
    tags: "Branding Identity · 2023",
    categories: ["Branding"],
    layout: "medium",
    theme: 5,
  },
  // Film
  {
    id: "pastil",
    title: "Pastil",
    tags: "Films · 2025",
    categories: ["Film"],
    award: true,
    awardNote: "Dubai · Philippines · LA",
    layout: "tall",
    theme: 1,
  },
  {
    id: "ang-maniniyot",
    title: "Ang Maniniyot ni Papa Jisos",
    tags: "Films · 2024",
    categories: ["Film"],
    award: true,
    awardNote: "Philippines",
    layout: "tall",
    theme: 2,
  },
  // UI / UX
  {
    id: "g-spot",
    title: "G-Spot | Smart Parking Finder App",
    tags: "UI/UX · 2025",
    categories: ["UI / UX"],
    layout: "medium",
    theme: 3,
  },
  {
    id: "createlab",
    title: "CreateLab Studios",
    tags: "UI/UX · 2022",
    categories: ["UI / UX"],
    layout: "medium",
    theme: 4,
  },
  // Marketing
  {
    id: "marketing-materials",
    title: "Marketing Materials",
    tags: "Creative Strategy · 2026",
    categories: ["Marketing"],
    layout: "wide",
    theme: 5,
  },
];

/** Case study cards (the "Case Studies" section). One reusable shape for all. */
export type CaseStudy = {
  id: string;
  title: string;
  category: string; // filter taxonomy value, e.g. "Motion"
  /** Optional display override for the meta line, e.g. "Motion Design". */
  categoryLabel?: string;
  year: string; // e.g. "2026"
  tags: string[]; // additional tags, e.g. ["SaaS", "Design"]
  /** Muted, looping, compressed clip that plays in the media container. */
  video?: string;
  /** Alternative to `video`: an animated gif. */
  gif?: string;
  /** Still shown before the clip loads / if no clip is set. */
  poster?: string;
  /** Parallax backdrop image; falls back to a branded gradient. */
  background?: string;
  href?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "absliq",
    title: "Absliq • CS Ticketing SaaS",
    category: "Motion",
    year: "2026",
    tags: ["SaaS", "Storyboard", "Design", "Animation"],
    video: "/case-studies/cover-absliq.mp4",
    background: "/case-studies/bg-absliq.png",
  },
  {
    id: "galerly",
    title: "Galerly • Photography SaaS",
    category: "Motion",
    year: "2026",
    tags: ["SaaS", "Storyboard", "Design", "Animation"],
    video: "/case-studies/cover-galerly.mp4",
    background: "/case-studies/bg-galerly.png",
  },
  {
    id: "property-inspect",
    title: "Property Inspect • Real Estate SaaS",
    category: "Motion",
    year: "2026",
    tags: ["SaaS", "Design", "2D", "3D", "Animation"],
    video: "/case-studies/cover-property-inspect.mp4",
    background: "/case-studies/bg-property-inspect.png",
  },
  {
    id: "swimbook",
    title: "SwimBook.ai • Swim Team Management SaaS",
    category: "Motion",
    year: "2026",
    tags: ["SaaS", "Storyboard", "Design", "2D & 3D Animation"],
    video: "/case-studies/cover-swimbook.mp4",
    background: "/case-studies/bg-swimbook.png",
  },
  {
    id: "motion-animation-reel-2025",
    title: "Motion Design & Animation Show Reel",
    category: "Motion",
    categoryLabel: "Motion Design",
    year: "2025",
    tags: ["Storyboard", "Design", "2D", "3D", "Video Editing"],
    video: "/case-studies/cover-reel-2025.mp4",
    background: "/case-studies/bg-reel-2025.png",
  },
  {
    id: "pamulak",
    title: "Pamulak National Arts Month Celebration",
    category: "Branding",
    year: "2023",
    tags: ["Identity", "Campaign"],
  },
  {
    id: "pastil",
    title: "Pastil",
    category: "Film",
    year: "2025",
    tags: ["Short Film", "Award-winning"],
  },
  {
    id: "ang-maniniyot",
    title: "Ang Maniniyot ni Papa Jisos",
    category: "Film",
    year: "2024",
    tags: ["Short Film", "Award-winning"],
  },
  {
    id: "g-spot",
    title: "G-Spot | Smart Parking Finder App",
    category: "UI / UX",
    year: "2025",
    tags: ["Product", "Mobile"],
  },
  {
    id: "createlab",
    title: "CreateLab Studios",
    category: "UI / UX",
    year: "2022",
    tags: ["Web", "Brand"],
  },
];

export type ServiceShape = {
  src: string;
  /** resting (hover) position within the card's media zone (CSS values) */
  top?: string;
  left?: string;
  right?: string;
  /** width as a percentage of the card */
  width: string;
  /** forward lift (px) applied on hover for the 3D float */
  depth: number;
  /** resting rotation, degrees */
  rotate?: number;
  /** idle origin offset (% of own box) the shape eases out from on hover */
  fromX?: string;
  fromY?: string;
  /** idle scale (defaults 0.5) */
  idleScale?: number;
  /** hover scale — lets hover grow independently of the idle size (defaults 1) */
  hoverScale?: number;
  /**
   * The lead shape is visible at idle (as the centred motif) and travels to its
   * resting spot on hover — no crossfade. Others scale/fade in.
   */
  lead?: boolean;
};

export type Service = {
  number: string;
  title: string;
  description: string;
  /** scattered composition — the lead shape also serves as the idle motif */
  cluster: ServiceShape[];
  /** render the hinged clapperboard motif instead of the shape cluster */
  clapper?: boolean;
  /** render the assembling browser-window motif instead of the shape cluster */
  web?: boolean;
  /** render the video-editing timeline motif instead of the shape cluster */
  edit?: boolean;
};

const shape = {
  bowtie: "/services/motion-bowtie.svg",
  circle: "/services/motion-circle.svg",
  diamond: "/services/motion-diamond.svg",
  nib: "/services/branding-nib.svg",
} as const;

// Motion Design and Branding have bespoke assets; the remaining cards reuse the
// Motion composition as a placeholder until their own shapes are added.
const motionCluster: ServiceShape[] = [
  { src: shape.bowtie, top: "2%", right: "5%", width: "46%", depth: 72, rotate: -6, lead: true, idleScale: 0.69, fromX: "-48%", fromY: "82%" },
  { src: shape.circle, top: "24%", left: "2%", width: "24%", depth: 40, fromX: "150%", fromY: "60%" },
  { src: shape.diamond, top: "46%", right: "20%", width: "20%", depth: 56, rotate: 6, fromX: "-70%", fromY: "-40%" },
];

// Branding: a single pen-nib that scales up and spins to 135° on hover.
const brandingCluster: ServiceShape[] = [
  { src: shape.nib, top: "13%", right: "2%", width: "108%", depth: 60, rotate: -135, lead: true, idleScale: 0.62, hoverScale: 1.5, fromX: "2%", fromY: "16%" },
];

export const services: Service[] = [
  {
    number: "01",
    title: "Motion Design",
    description:
      "2D/3D animation, title sequences, motion graphics, and kinetic typography that bring ideas to life.",
    cluster: motionCluster,
  },
  {
    number: "02",
    title: "Branding",
    description:
      "Brand identity systems, logo design, visual language, and guidelines built to last and move.",
    cluster: brandingCluster,
  },
  {
    number: "03",
    title: "Filmmaking",
    description:
      "Concept, direction, and edit — short films and brand stories shot with a cinematic, art-led eye.",
    cluster: motionCluster,
    clapper: true,
  },
  {
    number: "04",
    title: "Web Design",
    description:
      "Editorial, interactive sites that turn a portfolio or product into an experience worth lingering on.",
    cluster: motionCluster,
    web: true,
  },
  {
    number: "05",
    title: "Video Editing",
    description:
      "Rhythm, pacing, and polish — cutting raw footage into tight, expressive, scroll-stopping pieces.",
    cluster: motionCluster,
    edit: true,
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  companyUrl?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Ingrid doesn't just animate — she directs emotion. Our brand film felt cinematic from frame one.",
    name: "Franky Arrocena",
    role: "Creative Director",
    company: "Duwende Films",
    companyUrl: "https://www.facebook.com/DuwendeFilmsProd",
  },
  {
    id: "2",
    quote:
      "Ingrid delivered an exceptional logo animation that elevated our brand presence at OM Boracay. The motion felt premium, intentional, and perfectly aligned with the energy we wanted to communicate. Her attention to detail and creative instinct made the entire process seamless.",
    name: "Neal Sacdal",
    role: "Marketing Director",
    company: "OM Boracay",
    companyUrl: "https://www.facebook.com/OmBarBoracay/",
  },
  {
    id: "3",
    quote:
      "Ingrid brings rare range across motion, brand, and digital. She communicates clearly, meets deadlines, and elevates every deliverable — a true partner for fast-moving marketing teams.",
    name: "Samuel Lafuente",
    role: "HR Head",
    company: "ROI Media Digital Marketing",
  },
];

export const site = {
  name: "ingrid silfverberg",
  title: "ingrid silfverberg — motion artist",
  email: "motionbyerin@gmail.com",
  instagram: "https://www.instagram.com/motion.by.erin/",
  instagramHandle: "@motion.by.erin",
  vimeo: "https://vimeo.com/user114953797?fl=pl&fe=by",
  behance: "https://www.behance.net/eisilfverberg",
  tallyProjectUrl: "https://tally.so/r/b56rx0",
  showreelVimeo: "https://player.vimeo.com/video/1173596837",
  /** Looping, muted preview reel for the scroll experience.
   *  Drop the files at these paths in public/ (webm optional). */
  showreelVideo: "/showreel.mp4",
  showreelVideoWebm: "/showreel.webm",
  showreelPoster: "/images/showreel-poster.jpg",
  showreelBody:
    "I create motion-driven visuals and digital content that bring ideas, stories, and brands to life. From product animations and brand identities to cinematic visuals and digital campaigns, I turn concepts into compelling visual experiences that leave a lasting impression.",
  heroSpline:
    "https://prod.spline.design/0K1F2NrFx2E9F3Dl/scene.splinecode",
  tagline: "Turning vision into motion.",
  location: "Based in the Philippines · Working globally",
  /** Drop your portrait at public/images/about.jpg (or update this path). */
  aboutPhoto: "/images/about.jpg",
} as const;
