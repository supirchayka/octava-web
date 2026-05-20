// src/types/api.ts

export type ApiImage = {
  id: number;
  url: string;
  fileId?: number;
  mime?: string | null;
  originalName?: string | null;
  sizeBytes?: number | null;
  heroVariant?: "DESKTOP" | "MOBILE" | null;
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

export type ContactsWorkingHour = {
  id: number;
  group: string;
  label: string;
  isClosed: boolean;
  open: string | null;
  close: string | null;
};

export type ContactsMetroStation = {
  id: number;
  name: string;
  distanceMeters: number | null;
  line: string | null;
};

export type ContactsBlock = {
  phone: string | null;
  email: string | null;
  telegramUrl: string | null;
  whatsappUrl: string | null;
  maxMessengerUrl: string | null;
  address: string | null;
  yandexMapUrl: string | null;
  workingHours: ContactsWorkingHour[];
  metroStations: ContactsMetroStation[];
};

export type ContactsPageResponse = {
  page: PageInfo;
  seo: SeoBlock | null;
  contacts: ContactsBlock;
};

export type PricesPageResponse = {
  page: PageInfo;
  seo: SeoBlock | null;
  prices: {
    priceListFile: {
      id: number;
      url: string;
      mime: string;
      name: string;
      sizeBytes: number;
    } | null;
  };
};

export type ServicesPageCopy = {
  landingTitle: string;
  landingDescription: string;
  femaleCardTitle: string;
  femaleCardDescription: string;
  maleCardTitle: string;
  maleCardDescription: string;
  femaleTitle: string;
  femaleDescription: string;
  maleTitle: string;
  maleDescription: string;
};

export type ServicesPageResponse = {
  page: PageInfo;
  seo: SeoBlock | null;
  services: ServicesPageCopy;
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

export type MediaImage = ApiImage & {
  fileId: number;
  purpose: string;
  file: MediaFile;
};

export type Gender = "FEMALE" | "MALE";

export type ServiceCategory = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  gender: Gender;
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
  serviceCode: string;
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
    gender: Gender;
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
  serviceCode: string;
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
  serviceCode: string;
  price: string;
  durationMinutes: number | null;
  type: string; // "BASE" | "EXTRA" и т.п.
  sessionsCount?: number | null;
  order: number;
};

export type ChecklistItem = {
  id: number;
  text: string;
  order: number;
};

export type ServiceDetailResponse = {
  service: {
    about: string | null;
    id: number;
    slug: string;
    name: string;
    serviceCode: string;
    category: {
      id: number;
      slug: string;
      name: string;
    };
  };
  seo: SeoBlock | null;
  hero: ServiceDetailHero;
  specialists: Specialist[];
  pricesExtended: ServicePriceExtended[];
  indications: string[];
  contraindications: string[];
  preparationChecklist: ChecklistItem[];
  rehabChecklist: ChecklistItem[];
  devices: DeviceRelatedService[]; // пока пусто, можно потом типизировать
  galleryImages: ApiImage[];
  inlineImages: ApiImage[];
  faq: FaqItem[];
  legalDisclaimer: string | null;
};

export type ServicePriceCategory = {
  gender: Gender;
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  services: {
    id: number;
    slug: string;
    name: string;
    serviceCode: string;
    shortOffer: string | null;
    priceFrom: string | null;
    durationMinutes: number | null;
    pricesExtended: ServicePriceExtended[];
  }[];
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

export type OrganizationSummary = Pick<
  Organization,
  "id" | "fullName" | "address" | "email" | "phones"
>;

// ---- /devices (каталог) ----

export type DeviceListItem = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  positioning: string;
  heroImage: ApiImage | null;
};

// ---- /devices/:slug (детальная) ----

export type DeviceCore = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  positioning: string;
  principle: string | null;
  safetyNotes: string | null;
};

export type DeviceHero = {
  brand: string | null;
  model: string | null;
  positioning: string | null;
  certBadges: string[]; // массив бейджей/сертификатов (названия)
  images: MediaImage[];
};

export type DeviceSideEffect = {
  id: number;
  text: string;
  rarity: string | null; // например COMMON/RARE и т.п.
};

// FAQ у тебя уже есть для услуг, можно переиспользовать:
export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  order: number;
};

// Если у тебя уже есть CategoryService для услуг, переиспользуем
export type DeviceRelatedService = {
  id: number;
  slug: string;
  name: string;
  serviceCode: string;
  shortOffer: string | null;
  priceFrom: string | null;
  durationMinutes: number | null;
  benefits?: string[] | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
};

export type DeviceDetailResponse = {
  device: DeviceCore;
  seo: SeoBlock | null;
  hero: DeviceHero;
  galleryImages: MediaImage[];
  inlineImages: MediaImage[];
  attachments: MediaFile[]; // структура может отличаться, но ключ обязателен
  indications: string[];
  contraindications: string[];
  sideEffects: DeviceSideEffect[];
  documents: MediaFile[]; // тоже массив, даже если пустой
  faq: FaqItem[];
  services: DeviceRelatedService[];
};

export type GenericFileRef = {
  id?: number;
  title?: string | null;
  name?: string | null;
  label?: string | null;
  description?: string | null;
  caption?: string | null;
  url?: string | null;
  file?: MediaFile | null;
};

export type SpecialistService = {
  id: number;
  slug: string;
  name: string;
  serviceCode: string;
  shortOffer: string | null;
  priceFrom: string | null;
  sortOrder: number;
};

export type SpecialistPhoto = {
  id: number;
  url: string;
  originalName: string;
  mime: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
};

export type Specialist = {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  sortOrder?: number | null;
  specialization: string;
  biography: string | null;
  serviceComment?: string | null;
  experienceYears: number;
  photo: SpecialistPhoto | null;
  services: SpecialistService[];
};
