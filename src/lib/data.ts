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

export const services = [
  {
    num: "01",
    title: "Motion Design",
    description:
      "2D/3D animation, title sequences, motion graphics, and kinetic typography that bring ideas to life.",
  },
  {
    num: "02",
    title: "Branding",
    description:
      "Brand identity systems, logo design, visual language, and guidelines built to last and move.",
  },
  {
    num: "03",
    title: "Filmmaking",
    description:
      "Direction, cinematography, and editing for short films, commercials, and documentary work.",
  },
  {
    num: "04",
    title: "UI / UX Design",
    description:
      "Interface design, prototyping, and interaction design for web and mobile experiences.",
  },
  {
    num: "05",
    title: "Marketing",
    description:
      "Campaign design, social content, print, and digital materials that actually convert.",
  },
] as const;

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
  heroSpline:
    "https://prod.spline.design/0K1F2NrFx2E9F3Dl/scene.splinecode",
  tagline: "Turning vision into motion.",
  location: "Based in the Philippines · Working globally",
  /** Drop your portrait at public/images/about.jpg (or update this path). */
  aboutPhoto: "/images/about.jpg",
} as const;
