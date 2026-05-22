import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Outing, Discovery } from '@/types';

interface Story {
    id: number;
    title: string;
    description: string;
    status: 'draft' | 'generating' | 'completed' | 'published';
    created_at: string;
    user: {
        name: string;
    };
}

interface DashboardStats {
    total_outings: number;
    published_outings: number;
    recommended_outings: number;
    total_discoveries: number;
    free_outings: number;
    total_stories: number;
    completed_stories: number;
    published_stories: number;
}

interface DashboardProps {
    stats: DashboardStats;
    recent_outings: Outing[];
    recent_discoveries: Discovery[];
    recent_stories: Story[];
}

export default function AdminDashboard({ stats, recent_outings, recent_discoveries, recent_stories }: DashboardProps) {
    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold">
                    Dashboard
                </h2>
            }
        >
            <Head title="CMS Dashboard" />

            <div className="p-6 lg:p-8 space-y-8">
                {/* Statistics Grid */}
                <div>
                    <div className="flex items-center space-x-3 mb-5">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-white">Statistieken Overzicht</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div className="bg-gradient-to-br from-[#232734] to-[#1e2330] p-6 rounded-xl border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                    📝
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stats.total_outings}</p>
                            <p className="text-sm text-gray-400">Uitjes</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#232734] to-[#1e2330] p-6 rounded-xl border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                                    ✍️
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-cyan-400 mb-1">{stats.total_stories}</p>
                            <p className="text-sm text-gray-400">AI Stories</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#232734] to-[#1e2330] p-6 rounded-xl border border-gray-700/30 hover:border-emerald-500/30 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                    ✅
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-emerald-400 mb-1">{stats.published_outings}</p>
                            <p className="text-sm text-gray-400">Gepubliceerd</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#232734] to-[#1e2330] p-6 rounded-xl border border-gray-700/30 hover:border-amber-500/30 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                    ⭐
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-amber-400 mb-1">{stats.recommended_outings}</p>
                            <p className="text-sm text-gray-400">Aanbevolen</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#232734] to-[#1e2330] p-6 rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                    ✨
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-purple-400 mb-1">{stats.total_discoveries}</p>
                            <p className="text-sm text-gray-400">Ontdekkingen</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#232734] to-[#1e2330] p-6 rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                                    🎁
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-green-400 mb-1">{stats.free_outings}</p>
                            <p className="text-sm text-gray-400">Gratis Uitjes</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#232734] to-[#1e2330] p-6 rounded-xl border border-gray-700/30 hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                    🤖
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-indigo-400 mb-1">{stats.completed_stories}</p>
                            <p className="text-sm text-gray-400">AI Voltooid</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <div className="flex items-center space-x-3 mb-5">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-white">Snelle Acties</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Link
                            href="/admin/outings"
                            className="block bg-gradient-to-br from-[#232734] to-[#1e2330] border border-gray-700/30 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 text-3xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                📝
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Uitjes Beheren</h4>
                            <p className="text-sm text-gray-400 mb-4">Bekijk en bewerk alle uitjes</p>
                            <span className="text-blue-400 text-sm font-medium inline-flex items-center group-hover:gap-2 transition-all">
                                Beheer uitjes
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            href="/admin/stories/create"
                            className="block bg-gradient-to-br from-cyan-500 to-blue-500 border border-cyan-400/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                ✍️
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">AI Story Maken</h4>
                            <p className="text-sm text-white/80 mb-4">Laat AI een verhaal schrijven</p>
                            <span className="text-white text-sm font-semibold inline-flex items-center group-hover:gap-2 transition-all">
                                Nieuwe Story
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            href="/admin/outings/create"
                            className="block bg-gradient-to-br from-emerald-500 to-teal-500 border border-emerald-400/30 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                                ➕
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Nieuw Uitje</h4>
                            <p className="text-sm text-white/80 mb-4">Deel een nieuwe ervaring</p>
                            <span className="text-white text-sm font-semibold inline-flex items-center group-hover:gap-2 transition-all">
                                Nieuw aanmaken
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            href="/admin/discoveries"
                            className="block bg-gradient-to-br from-[#232734] to-[#1e2330] border border-gray-700/30 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 text-3xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                ✨
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Ontdekkingen</h4>
                            <p className="text-sm text-gray-400 mb-4">Beheer alle ontdekkingen</p>
                            <span className="text-purple-400 text-sm font-medium inline-flex items-center group-hover:gap-2 transition-all">
                                Naar ontdekkingen
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            href="/"
                            target="_blank"
                            className="block bg-gradient-to-br from-[#232734] to-[#1e2330] border border-gray-700/30 rounded-xl p-6 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 text-3xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                                🌐
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Bekijk Website</h4>
                            <p className="text-sm text-gray-400 mb-4">Ga naar de publieke website</p>
                            <span className="text-orange-400 text-sm font-medium inline-flex items-center group-hover:gap-2 transition-all">
                                Naar website
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Recent Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Outings */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                                <div className="w-1 h-7 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white">Recente Uitjes</h3>
                            </div>
                            <Link href="/admin/outings" className="text-sm text-emerald-400 hover:text-emerald-300 transition">
                                Bekijk alles →
                            </Link>
                        </div>
                        <div className="bg-[#232734] rounded-xl border border-gray-700/50 divide-y divide-gray-700/50">
                            {recent_outings.length > 0 ? (
                                recent_outings.map((outing) => (
                                    <Link
                                        key={outing.id}
                                        href={`/admin/outings/${outing.id}/edit`}
                                        className="block p-4 hover:bg-gray-700/30 transition"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={outing.featured_image || 'https://via.placeholder.com/80'}
                                                alt={outing.title}
                                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white truncate">{outing.title}</h4>
                                                <p className="text-sm text-gray-400">{outing.city}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {outing.is_recommended && (
                                                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">⭐ Aanbevolen</span>
                                                    )}
                                                    {outing.is_free && (
                                                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30">🎁 Gratis</span>
                                                    )}
                                                    <span className="text-xs text-gray-500">
                                                        {outing.discoveries?.length || 0} ontdekkingen
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    <p className="mb-2">Nog geen uitjes toegevoegd</p>
                                    <Link href="/admin/outings/create" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-flex items-center gap-1 font-medium">
                                        Maak je eerste uitje
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent AI Stories */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                                <div className="w-1 h-7 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white">Recente AI Stories</h3>
                            </div>
                            <Link href="/admin/stories" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
                                Bekijk alles →
                            </Link>
                        </div>
                        <div className="bg-[#232734] rounded-xl border border-gray-700/50 divide-y divide-gray-700/50">
                            {recent_stories.length > 0 ? (
                                recent_stories.map((story) => (
                                    <Link
                                        key={story.id}
                                        href={`/admin/stories/${story.id}/edit`}
                                        className="block p-4 hover:bg-gray-700/30 transition"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
                                                ✍️
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white truncate">{story.title}</h4>
                                                <p className="text-sm text-gray-400 line-clamp-2 mt-1">{story.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {story.status === 'completed' && (
                                                        <span className="text-xs bg-green-600/20 text-green-300 px-2 py-0.5 rounded border border-green-600/30">✅ Voltooid</span>
                                                    )}
                                                    {story.status === 'generating' && (
                                                        <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded border border-blue-600/30">🤖 Genereren...</span>
                                                    )}
                                                    {story.status === 'draft' && (
                                                        <span className="text-xs bg-gray-600/20 text-gray-300 px-2 py-0.5 rounded border border-gray-600/30">📝 Concept</span>
                                                    )}
                                                    <span className="text-xs text-gray-500">
                                                        door {story.user.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    <p className="mb-2">Nog geen AI stories gemaakt</p>
                                    <Link href="/admin/stories/create" className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 inline-flex items-center gap-1 font-medium">
                                        Maak je eerste AI story
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Discoveries */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                                <div className="w-1 h-7 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-white">Recente Ontdekkingen</h3>
                            </div>
                            <Link href="/admin/discoveries" className="text-sm text-purple-400 hover:text-purple-300 transition">
                                Bekijk alles →
                            </Link>
                        </div>
                        <div className="bg-[#232734] rounded-xl border border-gray-700/50 divide-y divide-gray-700/50">
                            {recent_discoveries.length > 0 ? (
                                recent_discoveries.map((discovery) => (
                                    <div key={discovery.id} className="p-4 hover:bg-white/5 transition-all duration-200 group">
                                        <div className="flex items-start gap-4">
                                            {discovery.image && (
                                                <img
                                                    src={discovery.image}
                                                    alt={discovery.title}
                                                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white">{discovery.title}</h4>
                                                <p className="text-sm text-gray-400 line-clamp-2 mt-1">{discovery.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded capitalize border border-gray-600">
                                                        {discovery.type}
                                                    </span>
                                                    {discovery.outing && (
                                                        <span className="text-xs text-gray-500">
                                                            → {discovery.outing.title}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <p>Nog geen ontdekkingen toegevoegd</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
