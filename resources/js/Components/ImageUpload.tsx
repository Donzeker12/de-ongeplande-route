import { useRef, useState } from 'react';
import axios from 'axios';
import MediaPicker from '@/Components/MediaPicker';
import ImageEditorModal from '@/Components/ImageEditorModal';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
}

export default function ImageUpload({ value, onChange, placeholder = 'https://...' }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [editingCurrent, setEditingCurrent] = useState(false);

    const uploadAndSet = async (file: File) => {
        setUploading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post('/admin/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onChange(response.data.url);
        } catch {
            setUploadError('Upload mislukt. Probeer het opnieuw of gebruik een URL.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingFile(file);
        e.target.value = '';
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput('');
            setShowUrlInput(false);
        }
    };

    return (
        <div>
            {pendingFile && (
                <ImageEditorModal
                    file={pendingFile}
                    onSave={(f) => { setPendingFile(null); uploadAndSet(f); }}
                    onCancel={() => setPendingFile(null)}
                />
            )}
            {editingCurrent && value && (
                <ImageEditorModal
                    src={value}
                    onSave={(f) => { setEditingCurrent(false); uploadAndSet(f); }}
                    onCancel={() => setEditingCurrent(false)}
                />
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {value ? (
                /* Image preview */
                <div className="relative rounded-xl overflow-hidden border border-gray-700 group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full aspect-video object-cover"
                    />
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setEditingCurrent(true)}
                            disabled={uploading}
                            className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 rounded-lg text-xs font-medium backdrop-blur-sm transition flex items-center gap-1.5"
                        >
                            ✏️ Bewerken
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium backdrop-blur-sm transition flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Vervangen
                        </button>
                        <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium backdrop-blur-sm transition flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Bibliotheek
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-xs font-medium backdrop-blur-sm transition flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Verwijderen
                        </button>
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    )}
                </div>
            ) : (
                /* Empty upload zone */
                <div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-gray-700 hover:border-emerald-600 rounded-xl p-6 flex flex-col items-center gap-3 transition group bg-[#0f1117] hover:bg-emerald-950/20 disabled:opacity-50"
                    >
                        {uploading ? (
                            <svg className="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-gray-600 group-hover:text-emerald-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        )}
                        <div className="text-center">
                            <p className="text-sm text-gray-400 group-hover:text-gray-200 transition font-medium">
                                {uploading ? 'Uploaden...' : 'Klik om te uploaden'}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">JPG, PNG, WebP</p>
                        </div>
                    </button>

                    {/* Secondary actions */}
                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 border border-gray-700"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Bibliotheek
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowUrlInput((v) => !v)}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 border ${
                                showUrlInput
                                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 border-gray-700'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            URL invoeren
                        </button>
                    </div>

                    {showUrlInput && (
                        <div className="mt-2 flex gap-2">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                                placeholder={placeholder}
                                className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition text-sm"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleUrlSubmit}
                                className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition"
                            >
                                OK
                            </button>
                        </div>
                    )}
                </div>
            )}

            {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}

            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(url) => { onChange(url); setPickerOpen(false); }}
            />
        </div>
    );
}
