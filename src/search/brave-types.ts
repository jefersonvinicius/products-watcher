// Types for the Brave Web Search API response.
// https://api.search.brave.com/res/v1/web/search

export interface BraveSearchResponse {
  type: 'search';
  query: BraveQuery;
  mixed: BraveMixed;
  web: BraveWeb;
}

export interface BraveQuery {
  original: string;
  show_strict_warning: boolean;
  is_navigational: boolean;
  is_news_breaking: boolean;
  spellcheck_off: boolean;
  country: string;
  bad_results: boolean;
  should_fallback: boolean;
  postal_code: string;
  city: string;
  header_country: string;
  more_results_available: boolean;
  state: string;
}

export interface BraveMixed {
  type: 'mixed';
  main: BraveMixedRef[];
  top: BraveMixedRef[];
  side: BraveMixedRef[];
}

export interface BraveMixedRef {
  type: string;
  index: number;
  all: boolean;
}

export interface BraveWeb {
  type: 'search';
  results: BraveResult[];
  family_friendly: boolean;
}

export type BraveResultSubtype =
  | 'generic'
  | 'product'
  | 'faq'
  | 'article'
  | 'product_cluster'
  | 'qa'
  | (string & {});

export interface BraveResult {
  title: string;
  url: string;
  is_source_local: boolean;
  is_source_both: boolean;
  description: string;
  page_age?: string;
  age?: string;
  language: string;
  family_friendly: boolean;
  type: 'search_result';
  subtype: BraveResultSubtype;
  is_live: boolean;
  profile?: BraveProfile;
  meta_url?: BraveMetaUrl;
  thumbnail?: BraveThumbnail;
  product?: BraveProduct;
  product_cluster?: BraveProduct[];
  faq?: BraveFaq;
  qa?: BraveQa;
  article?: BraveArticle;
  organization?: BraveOrganization;
  extra_snippets?: string[];
}

export interface BraveProfile {
  name: string;
  url: string;
  long_name: string;
  img: string;
}

export interface BraveMetaUrl {
  scheme: string;
  netloc: string;
  hostname: string;
  favicon: string;
  path: string;
}

export interface BraveThumbnail {
  src: string;
  original: string;
  logo?: boolean;
}

export interface BraveOffer {
  url: string;
  priceCurrency: string;
  price: string;
}

export interface BraveRating {
  ratingValue: number;
  bestRating: number;
  reviewCount: number;
  is_tripadvisor: boolean;
}

export interface BraveProduct {
  type: 'Product';
  name: string;
  price: string;
  thumbnail?: BraveThumbnail;
  description?: string;
  offers?: BraveOffer[];
  rating?: BraveRating;
}

export interface BraveFaq {
  items: BraveFaqItem[];
}

export interface BraveFaqItem {
  question: string;
  answer: string;
  title: string;
  url: string;
  meta_url?: BraveMetaUrl;
}

export interface BraveQa {
  question: string;
  answer: {
    text: string;
    upvoteCount?: number;
  };
}

export interface BraveArticleAuthor {
  type: 'person';
  name: string;
  url?: string;
  thumbnail?: BraveThumbnail;
}

export interface BraveArticlePublisher {
  type: 'organization';
  name: string;
  url?: string;
  thumbnail?: BraveThumbnail;
}

export interface BraveArticle {
  author?: BraveArticleAuthor[];
  date?: string;
  publisher?: BraveArticlePublisher;
  isAccessibleForFree?: boolean;
}

export interface BraveOrganization {
  type: 'organization';
  name: string;
  contact_points?: unknown[];
}