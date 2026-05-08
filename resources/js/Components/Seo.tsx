import { Head } from '@inertiajs/react';

interface SeoProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    /** JSON-LD structured data objects */
    structuredData?: object | object[];
    /** noindex this page */
    noIndex?: boolean;
    /** City/region for geo SEO */
    geoRegion?: string;
    geoPlacename?: string;
    /** Canonical override */
    canonical?: string;
    /** Article publish/modify dates */
    publishedAt?: string;
    modifiedAt?: string;
}

export default function Seo({
    title,
    description,
    image,
    url,
    type = 'website',
    structuredData,
    noIndex = false,
    geoRegion,
    geoPlacename,
    canonical,
    publishedAt,
    modifiedAt,
}: SeoProps) {
    const siteUrl = window.location.origin;
    const currentUrl = canonical ?? url ?? window.location.href;
    const ogImage = image ?? `${siteUrl}/build/assets/og-default.jpg`;
    const siteName = 'De Ongeplande Route';
    const fullTitle = title.includes(siteName) ? title : `${title} – ${siteName}`;

    const schemas = structuredData
        ? Array.isArray(structuredData)
            ? structuredData
            : [structuredData]
        : [];

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            <link rel="canonical" href={currentUrl} />

            {/* Geo tags */}
            {geoRegion && <meta name="geo.region" content={geoRegion} />}
            {geoPlacename && <meta name="geo.placename" content={geoPlacename} />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="nl_NL" />
            {publishedAt && <meta property="article:published_time" content={publishedAt} />}
            {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Structured Data */}
            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </Head>
    );
}
