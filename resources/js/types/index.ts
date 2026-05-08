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
    description: string | null;
    city: string | null;
    country: string;
    address: string | null;
    website: string | null;
    featured_image: string | null;
    outings_count?: number;
}

export type VenueType = {
    label: string;
    emoji: string;
};
