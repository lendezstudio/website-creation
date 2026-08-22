/**
 * LENDEZ STUDIO — PORTFOLIO DATA
 * ------------------------------------------------------------
 * This is the single source of truth for every project shown
 * on the homepage and the Work page.
 *
 * TO ADD A NEW PROJECT:
 * Copy one of the objects below, edit the fields, and add it
 * to the PORTFOLIO array. Nothing else needs to change — the
 * homepage (3 featured projects) and Work page (all projects)
 * both render from this file automatically.
 *
 * IMAGES:
 * desktopImage / mobileImage point to files under /images/.
 * Until real screenshots are added, the site shows a clearly
 * labeled placeholder frame instead of a broken image.
 * ------------------------------------------------------------
 */

const PORTFOLIO = [
  {
    projectName: "Quantum Chrysalis",
    slug: "quantum-chrysalis",
    projectType: "Client Project",
    isClientWork: true,
    industry: "Financial Services",
    category: "client",
    categoryLabel: "Client Project",
    badge: "Client Project",
    description:
      "A digital presence built for Quantum Chrysalis to bring its financial protection services, career opportunities, and consultation journey into one professional online experience.",
    focusAreas: [
      "Brand presentation",
      "Clear service communication",
      "Lead generation",
      "Career opportunity presentation",
      "Responsive design",
      "Customer journey",
    ],
    desktopImage: "/images/quantum-chrysalis-desktop.webp",
    mobileImage: "/images/quantum-chrysalis-mobile.webp",
    liveUrl: "https://www.quantumchrysalis.com/",
    ctaLabel: "Visit Live Website",
    featured: true,
    displayOrder: 1,
    layout: "feature",
  },
  {
    projectName: "JD Beach Front Hotel",
    slug: "jd-beach-front-hotel",
    projectType: "Website Concept",
    isClientWork: false,
    industry: "Hospitality · Beachfront Hotel",
    category: "hospitality",
    categoryLabel: "Hospitality Concept",
    badge: "Hospitality Concept",
    description:
      "A beachfront hotel concept designed to showcase accommodations, location, and marine experiences, with guest questions answered and an inquiry always one tap away.",
    focusAreas: [
      "Accommodation presentation",
      "Guest journey",
      "Direct inquiry",
      "Mobile-first experience",
      "FAQ",
      "Visual storytelling",
    ],
    desktopImage: "/images/jd-beach-front-desktop.webp",
    mobileImage: "/images/jd-beach-front-mobile.webp",
    liveUrl: "https://lendezstudio.github.io/Jd-s-Beach-Front-Hotel/",
    ctaLabel: "View Website Concept",
    featured: true,
    displayOrder: 2,
    layout: "media-left",
  },
  {
    projectName: "Kalinao Beach Hotel Resort & Farm",
    slug: "kalinao-beach-hotel-resort-farm",
    projectType: "Website Concept",
    isClientWork: false,
    industry: "Hospitality · Beach Resort & Farm Stay",
    category: "hospitality",
    categoryLabel: "Hospitality Concept",
    badge: "Hospitality Concept",
    description:
      "A resort-and-farm-stay concept presenting the property as a complete destination — helping potential guests explore accommodations and move toward an inquiry.",
    focusAreas: [
      "Accommodation showcase",
      "Resort experience",
      "Farm stay positioning",
      "Direct inquiries",
      "Mobile usability",
      "Clear navigation",
    ],
    desktopImage: "/images/kalinao-desktop.webp",
    mobileImage: "/images/kalinao-mobile.webp",
    liveUrl: "https://lendezstudio.github.io/Kalinao-Beach-and-Farm/",
    ctaLabel: "View Website Concept",
    featured: true,
    displayOrder: 3,
    layout: "media-right",
  },
  {
    projectName: "Dakdak Beach Resort",
    slug: "dakdak-beach-resort",
    projectType: "Website Concept",
    isClientWork: false,
    industry: "Hospitality · Beach Resort & Island Tourism",
    category: "hospitality",
    categoryLabel: "Hospitality Concept",
    badge: "Hospitality Concept",
    description:
      "A destination-focused concept built around the resort experience — overnight stays, day visits, and island travel — with a simple, direct path to inquire.",
    focusAreas: [
      "Destination storytelling",
      "Accommodation",
      "Day visits",
      "Guest experience",
      "Visual hierarchy",
      "Location information",
    ],
    desktopImage: "/images/dakdak-desktop.webp",
    mobileImage: "/images/dakdak-mobile.webp",
    liveUrl: "https://lendezstudio.github.io/Dakdak-Beach-Resort/",
    ctaLabel: "View Website Concept",
    featured: false,
    displayOrder: 4,
    layout: "media-left",
  },
  {
    projectName: "Southern Leyte Divers",
    slug: "southern-leyte-divers",
    projectType: "Website Concept",
    isClientWork: false,
    industry: "Diving · Adventure Tourism",
    category: "tourism",
    categoryLabel: "Tourism Concept",
    badge: "Tourism Concept",
    description:
      "A tourism concept communicating the Southern Leyte diving experience through immersive visuals, destination storytelling, and inquiry-focused calls to action.",
    focusAreas: [
      "Diving experience",
      "Destination marketing",
      "Adventure tourism",
      "Service presentation",
      "Mobile responsiveness",
      "Inquiry journey",
    ],
    desktopImage: "/images/southern-leyte-divers-desktop.webp",
    mobileImage: "/images/southern-leyte-divers-mobile.webp",
    liveUrl: "https://lendezstudio.github.io/southern-leyte-divers/",
    ctaLabel: "View Website Concept",
    featured: false,
    displayOrder: 5,
    layout: "media-right",
  },
];

// Sorted helpers used by the pages that render this data.
const getFeaturedProjects = () =>
  PORTFOLIO.filter((p) => p.featured).sort((a, b) => a.displayOrder - b.displayOrder);

const getAllProjects = () =>
  [...PORTFOLIO].sort((a, b) => a.displayOrder - b.displayOrder);
