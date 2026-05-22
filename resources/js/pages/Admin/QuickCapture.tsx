import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

interface Venue {
    id: number;
    name: string;
    type: string;
    city: string;
}

interface RecentOuting {
    id: number;
    title: string;
    city: string;
    venue_id: number | null;
    visit_date: string;
}

interface QuickCaptureProps {
    venues: Venue[];
    recentOutings: RecentOuting[];
    discoveryTypes: Record<string, string>;
}

export default function QuickCapture({ venues, recentOutings, discoveryTypes }: QuickCaptureProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showNewOutingForm, setShowNewOutingForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'dier',
        image: null as File | null,
        venue_id: '',
        outing_id: '',
        create_new_outing: false,
        new_outing_title: '',
        location_note: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/quick-capture', {
            onSuccess: () => {
                reset();
                setImagePreview(null);
                setShowNewOutingForm(false);
            },
        });
    };

    const triggerCamera = () => {
        fileInputRef.current?.click();
    };

    const toggleNewOuting = () => {
        const newValue = !showNewOutingForm;
        setShowNewOutingForm(newValue);
        setData('create_new_outing', newValue);
        if (!newValue) {
            setData('new_outing_title', '');
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        📸 Quick Capture
                        <span className="text-sm font-normal text-gray-400">Onderweg vastleggen</span>
                    </h2>
                </div>
            }
        >
            <Head title="Quick Capture - Onderweg vastleggen" />

            <div className="max-w-lg mx-auto p-4 space-y-6">
                {/* Success Messages */}
                {/* @ts-ignore */}
                {typeof window !== 'undefined' && window.flash?.success && (
                    <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
                        {/* @ts-ignore */}
                        {window.flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Camera/Image Section */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            📷 Foto
                        </h3>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {imagePreview ? (
                            <div className="relative">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setData('image', null);
                                    }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={triggerCamera}
                                className="w-full h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
                            >
                                <div className="text-4xl mb-2">📸</div>
                                <div className="text-center">
                                    <p className="font-medium">Maak een foto</p>
                                    <p className="text-sm">Informatiebord, dier, etc.</p>
                                </div>
                            </button>
                        )}
                        
                        {errors.image && (
                            <p className="text-red-400 text-sm mt-2">{errors.image}</p>
                        )}
                    </div>

                    {/* Quick Info */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">📝 Wat heb je ontdekt?</h3>
                        
                        {/* Title */}
                        <div>
                            <input
                                type="text"
                                placeholder="Titel (bijv: Japanse Makaak, Speeltuin)"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                        </div>

                        {/* Type Selector */}
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(discoveryTypes).map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setData('type', key)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                                        data.type === key
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Description */}
                        <div>
                            <textarea
                                placeholder="Wat was er bijzonder? Kort verhaal..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">📍 Waar ben je?</h3>
                        
                        {/* Venue Selector */}
                        <div>
                            <select
                                value={data.venue_id}
                                onChange={(e) => setData('venue_id', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Kies locatie...</option>
                                {venues.map((venue) => (
                                    <option key={venue.id} value={venue.id}>
                                        {venue.name} - {venue.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location Note */}
                        <input
                            type="text"
                            placeholder="Extra locatie info (optioneel)"
                            value={data.location_note}
                            onChange={(e) => setData('location_note', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Outing Selection */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">🗂️ Aan welk uitje koppelen?</h3>
                        
                        {/* Toggle New Outing */}
                        <button
                            type="button"
                            onClick={toggleNewOuting}
                            className={`w-full p-3 rounded-xl border text-sm font-medium transition-all ${
                                showNewOutingForm
                                    ? 'bg-green-600 border-green-500 text-white'
                                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            ✨ Nieuw uitje starten
                        </button>

                        {showNewOutingForm ? (
                            <input
                                type="text"
                                placeholder="Naam voor nieuwe uitje (bijv: Dag in Artis)"
                                value={data.new_outing_title}
                                onChange={(e) => setData('new_outing_title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        ) : (
                            <div>
                                <select
                                    value={data.outing_id}
                                    onChange={(e) => setData('outing_id', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Kies bestaand uitje...</option>
                                    {recentOutings.map((outing) => (
                                        <option key={outing.id} value={outing.id}>
                                            {outing.title} {outing.city ? `(${outing.city})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {errors.new_outing_title && (
                            <p className="text-red-400 text-sm">{errors.new_outing_title}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {processing ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Bezig...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <span>💾</span>
                                Ontdekking opslaan
                            </div>
                        )}
                    </button>
                </form>

                {/* Quick Access Info */}
                <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4 text-blue-200">
                    <p className="text-sm">
                        💡 <strong>Tip:</strong> Voeg deze pagina toe aan je telefoon home screen voor snelle toegang!
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}