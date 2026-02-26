// src/types/about.ts

import type { PageInfo, SeoBlock } from "./api";

type AboutMedia = {
  id: number;
  url: string;
  mime: string;
  width: number | null;
  height: number | null;
  alt: string | null;
};

export type AboutHero = {
  title: string;
  description: string;
  image: AboutMedia | null;
};

export type AboutHeroCta = {
  title: string;
  subtitle: string | null;
};

export type AboutTrustKind =
  | "LICENSE"
  | "CERTIFICATE"
  | "AWARD"
  | "ATTESTATION";

export type AboutTrustItem = {
  id: number;
  kind: AboutTrustKind;
  title: string;
  number: string | null;
  issuedAt: string | null;
  issuedBy: string | null;
  image: AboutMedia | null;
  file: {
    id: number;
    url: string;
    mime: string;
    name: string;
  } | null;
};

export type AboutFact = {
  id: number;
  title: string;
  text: string;
  order: number;
};

export type AboutPageResponse = {
  page: PageInfo;
  seo: SeoBlock | null;
  hero: AboutHero;
  trustItems: AboutTrustItem[];
  howWeAchieve: string | null;
  heroBadgeText: string | null;
  heroCardText: string | null;
  howWeAchieveTitle: string | null;
  howWeAchieveCardText: string | null;
  factsSectionTitle: string | null;
  trustSectionTitle: string | null;
  trustSectionSubtitle: string | null;
  facts: AboutFact[];
  heroCta: AboutHeroCta | null;
};
