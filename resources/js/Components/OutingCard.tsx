import { Link } from '@inertiajs/react';
import { Outing } from '@/types';

interface OutingCardProps {
    outing: Outing;
    size?: 'default' | 'featured';
    showDescription?: boolean;
}

export default function OutingCard({ outing, size = 'default', showDescription = false }: OutingCardProps) {
    const isFeatured = size === 'featured';
    
    return (
        <Link
            href={`/uitjes/${outing.slug}`}
            className={`group card overflow-hidden ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
        >
            {/* Image Container */}
            <div className={`relative overflow-hidden bg-warm-200 ${isFeatured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                {outing.featured_image && (
                    <img
                        src={outing.featured_image}
                        alt={outing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                    />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {outing.is_recommended && (
                        <span className="px-3 py-1 bg-accent-500 text-white text-xs font-medium rounded-full shadow-md">
                            ✨ Aanrader
                        </span>
                    )}
                    {outing.is_free && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-md">
                            🆓 Gratis
                        </span>
                    )}
                </div>
                
                {/* Category Badge */}
                {outing.category && (
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-warm-700 text-xs font-medium rounded-full shadow-md">
                            {outing.category}
                        </span>
                    </div>
                )}
                
                {/* Hover Content */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white">
                        <p className="text-sm mb-2 opacity-90">
                            {outing.city && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {outing.city}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
                <h3 className={`font-serif text-warm-800 mb-3 group-hover:text-warm-700 transition-colors ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
                    {outing.title}
                </h3>
                
                {showDescription && outing.story && (
                    <p className="text-warm-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {outing.story.substring(0, 150)}...
                    </p>
                )}
                
                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-warm-500">
                    <div className="flex items-center gap-4">
                        {outing.mood && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {outing.mood}
                            </span>
                        )}
                    </div>
                    
                    {outing.price_info && (
                        <span className="font-medium text-warm-700">
                            {outing.price_info}
                        </span>
                    )}
                </div>
                
                {/* Discovery Count */}
                {outing.discoveries && outing.discoveries.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-warm-200">
                        <span className="text-xs text-warm-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {outing.discoveries.length} ontdekking{outing.discoveries.length !== 1 ? 'en' : ''}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}