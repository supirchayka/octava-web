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
  file: unknown | null;
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
  facts: AboutFact[];
  heroCta: AboutHeroCta | null;
};
