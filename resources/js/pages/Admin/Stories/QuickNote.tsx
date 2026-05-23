import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function QuickNote() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        content: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/stories/quick-note');
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/stories"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Verhalen
                        </Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-300 text-sm">Snelle Notitie</span>
                    </div>
                </div>
            }
        >
            <Head title="Snelle Notitie" />

            <div className="p-6 lg:p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-1">Snelle Notitie ✍️</h1>
                        <p className="text-gray-400 text-sm">Snel iets vastleggen. Na opslaan ga je direct naar de volledige editor.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Titel */}
                        <div>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Titel van het verhaal..."
                                autoFocus
                                className="w-full bg-[#16181f] border border-gray-700 rounded-xl px-4 py-3 text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                            />
                            {errors.title && <p className="mt-1 text-red-400 text-xs">{errors.title}</p>}
                        </div>

                        {/* Korte omschrijving */}
                        <div>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Korte omschrijving (optioneel)..."
                                rows={2}
                                className="w-full bg-[#16181f] border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                            />
                        </div>

                        {/* Inhoud */}
                        <div>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Begin met schrijven... (je kunt dit later uitbreiden in de editor)"
                                rows={8}
                                className="w-full bg-[#16181f] border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                            />
                        </div>

                        {/* Acties */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing || !data.title.trim()}
                                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition"
                            >
                                {processing ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                Opslaan & verder bewerken
                            </button>
                            <Link
                                href="/admin/stories"
                                className="px-4 py-2.5 text-gray-400 hover:text-white transition text-sm"
                            >
                                Annuleren
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
