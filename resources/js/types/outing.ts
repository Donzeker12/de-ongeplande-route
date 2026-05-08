export interface PricePass {
    name: string;
    discount: string;
}\n
export interface PriceDetails {
    adult?: string;
    child?: string;
    senior?: string;
    baby?: string;
    passes?: PricePass[];
    notes?: string;
}\n
export interface Outing {
    id: number;
    title: string;
    slug: string;
    story?: string;
    location?: string;
    city?: string;
    price_info?: string;
    price_details?: PriceDetails;
    mood?: string;
    featured_image?: string;
    images?: string[];
    is_recommended?: boolean;
    is_free?: boolean;
    category?: string;
    category_id?: number | null;
    venue_id?: number | null;
    visit_date?: string;
    published_at?: string | null;
    updated_at?: string | null;
    seo_description?: string;
    discoveries_count?: number;
    discoveries?: Discovery[];
}

export interface Discovery {
    id: number;
    title: string;
    slug?: string;
    type: 'dier' | 'plek' | 'weetje';
    description: string;
    image?: string;
    outing_id?: number;
    outing_title?: string;
    outing?: Outing;
}

export interface HeroSettings {
    background_url: string;
    title: string;
    subtitle: string;
    description: string;
}

export interface HomePageProps {
    latestOutings: Outing[];
    recommendedOutings: Outing[];
    newDiscoveries: Discovery[];
    categories: string[];
    activeCategory: string | null;
    heroSettings: HeroSettings;
}
