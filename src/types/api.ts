// src/types/api.ts

export type ApiImage = {
  id: number;
  url: string;
  alt: string | null;
  caption: string | null;
  order: number | null;
};

export type SeoOgImage = {
  url: string;
  mime: string;
  width: number | null;
  height: number | null;
  alt: string | null;
};

export type SeoBlock = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  robotsIndex: boolean | null;
  robotsFollow: boolean | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: SeoOgImage | null;
};

export type PageInfo = {
  type: string;
  slug: string;
};

export type HomeHero = {
  title: string;
  subtitle: string;
  ctaText: string | null;
  ctaUrl: string | null;
  images: ApiImage[];
};

export type HomeDirectionCategory = {
  id: number;
  slug: string;
  name: string;
};

export type HomeDirection = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  heroImage: {
    id: number;
    url: string;
    mime: string;
    width: number | null;
    height: number | null;
    alt: string | null;
  } | null;
};

export type HomeSubHero = {
  title: string | null;
  subtitle: string | null;
  image: {
    url: string;
  }
};

export type HomeInterior = {
  text: string | null;
  images: ApiImage[];
};

export type HomePageResponse = {
  page: PageInfo;
  seo: SeoBlock | null;
  hero: HomeHero;
  directions: HomeDirection[];
  subHero: HomeSubHero;
  interior: HomeInterior;
};

// src/types/api.ts

export type MediaFile = {
  id: number;
  url: string;
  originalName: string;
  mime: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
};


export type ServiceCategory = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  servicesCount: number;
  seo: SeoBlock | null;
  heroImage: CategoryHeroImage | null;
  galleryImages: ApiImage[];
};

export type CategoryHeroImage = {
  id: number;
  fileId: number;
  purpose: string;
  order: number;
  alt: string | null;
  caption: string | null;
  url: string;
  file: {
    id: number;
    url: string;
    originalName: string;
    mime: string;
    sizeBytes: number;
    width: number | null;
    height: number | null;
  };
};

export type CategoryService = {
  id: number;
  slug: string;
  name: string;
  shortOffer: string | null;
  priceFrom: string | null;
  durationMinutes: number | null;
  benefits: string[];
  ctaText: string | null;
  ctaUrl: string | null;
};

export type ServiceCategoryDetails = {
  category: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    sortOrder: number;
    heroImage: CategoryHeroImage | null;
    galleryImages: ApiImage[];
  };
  seo: SeoBlock | null;
  services: CategoryService[];
};

// hero блока услуги
export type ServiceDetailHero = {
  title: string;
  shortOffer: string | null;
  priceFrom: string | null;
  durationMinutes: number | null;
  benefits: string[];
  ctaText: string | null;
  ctaUrl: string | null;
  images: ApiImage[];
};

export type ServicePriceExtended = {
  id: number;
  title: string;
  price: string;
  durationMinutes: number | null;
  type: string; // "BASE" | "EXTRA" и т.п.
  order: number;
};

export type ChecklistItem = {
  id: number;
  text: string;
  order: number;
};

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  order: number;
};

export type ServiceDetailResponse = {
  service: {
    id: number;
    slug: string;
    name: string;
    category: {
      id: number;
      slug: string;
      name: string;
    };
  };
  seo: SeoBlock | null;
  hero: ServiceDetailHero;
  about: string | null;
  pricesExtended: ServicePriceExtended[];
  indications: string[];
  contraindications: string[];
  preparationChecklist: ChecklistItem[];
  rehabChecklist: ChecklistItem[];
  //devices: any[]; // пока пусто, можно потом типизировать
  galleryImages: ApiImage[];
  inlineImages: ApiImage[];
  faq: FaqItem[];
  legalDisclaimer: string | null;
};

// Телефон организации
export type OrgPhone = {
  type: string;        // например, "MAIN"
  number: string;      // "+7 (495) 000-00-00"
  isPrimary: boolean;
};

// Организация / оператор ПД
export type Organization = {
  id: number;
  fullName: string;    // "ООО «Октава»"
  ogrn: string;
  inn: string;
  kpp: string | null;
  address: string;
  email: string;
  phones: OrgPhone[];
};
