export type * from './auth';
export type * from './outing';

export interface Category {
    id: number;
    name: string;
    slug: string;
    emoji: string;
    description: string | null;
    sort_order: number;
    outings_count?: number;
}

export interface Venue {
    id: number;
    name: string;
    slug: string;
    type: string;
    type_label: string;
    type_emoji: string;
    description: string | null;
    city: string | null;
    country: string;
    address: string | null;
    website: string | null;
    featured_image: string | null;
    opening_hours?: Record<string, { open: boolean; from: string; to: string }> | null;
    prices?: Record<string, { label: string; price: string }[]> | null;
    highlights?: string | null;
    accessibility_transport?: string | null;
    accessibility_facilities?: string | null;
    seo_description?: string;
    updated_at?: string;
    outings_count?: number;
}

export type VenueType = {
    label: string;
    emoji: string;
};
