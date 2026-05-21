import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';


export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [flashVisible, setFlashVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const uploadFile = async (file) => {
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(null);
        const formData = new FormData();
        formData.append('image', file);
        try {
            await axios.post('/admin/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setUploadSuccess('Opgeslagen!');
            setTimeout(() => setUploadSuccess(null), 3000);
        } catch {
            setUploadError('Upload mislukt');
            setTimeout(() => setUploadError(null), 3000);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setFlashVisible(true);
            const timer = setTimeout(() => setFlashVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const navigation = [
        { name: 'Dashboard',     href: '/admin/dashboard',   icon: '📊', current: route().current('admin.dashboard') },
        { name: 'Verhalen',      href: '/admin/outings',     icon: '📖', current: route().current('admin.outings.*') },
        { name: 'Stories',       href: '/admin/stories',     icon: '📝', current: route().current('admin.stories.*') },
        { name: 'Blog',          href: '/admin/blog',        icon: '✍️', current: route().current('admin.blog.*') },
        { name: 'Categorieën',   href: '/admin/categories',  icon: '🏷️', current: route().current('admin.categories.*') },
        { name: 'Locaties',      href: '/admin/venues',      icon: '📍', current: route().current('admin.venues.*') },
        { name: 'Ontdekkingen',  href: '/admin/discoveries', icon: '✨', current: route().current('admin.discoveries.*') },
        { name: 'Social',        href: '/admin/snippets',    icon: '📱', current: route().current('admin.snippets.*') },
        { name: 'Gebruikers',    href: '/admin/users',       icon: '👥', current: route().current('admin.users.*') },
        { name: 'Instellingen',  href: '/admin/settings',    icon: '⚙️', current: route().current('admin.settings.*') },
        { name: '🖼️ Media',     href: '/admin/media',       icon: '', current: route().current('admin.media.*'), media: true },
        { name: 'Website',       href: '/',                  icon: '🌐', current: false, external: true },
    ];

    return (
        <div className="min-h-screen bg-[#0f1117] flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#16181f] border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="px-5 py-6">
                        <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-xl group-hover:bg-emerald-400 transition-colors">
                                🌿
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-sm">De Ongeplande Route</h1>
                                <p className="text-gray-500 text-xs">CMS</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden absolute top-6 right-5 text-gray-400 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                target={item.external ? '_blank' : undefined}
                                className={`group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                                    item.current
                                        ? item.media ? 'bg-sky-500/10 text-sky-400' : 'bg-emerald-500/10 text-emerald-400'
                                        : item.media ? 'text-sky-400 hover:bg-sky-900/30 hover:text-sky-300' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium text-sm">{item.name}</span>
                                {item.current && (
                                    <div className={`ml-auto w-1 h-1 rounded-full ${item.media ? 'bg-sky-400' : 'bg-emerald-400'}`}></div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Quick Upload */}
                    <div className="border-t border-gray-800 px-3 pt-3 pb-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">Snel uploaden</p>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) uploadFile(f); }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors select-none ${
                                isDragging ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
                            }`}
                        >
                            {uploading ? (
                                <p className="text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                    Uploaden...
                                </p>
                            ) : uploadSuccess ? (
                                <p className="text-xs text-emerald-400 font-medium">✓ {uploadSuccess}</p>
                            ) : uploadError ? (
                                <p className="text-xs text-red-400">{uploadError}</p>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                                    <p className="text-xs text-gray-500">Sleep of klik</p>
                                </>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
                    </div>

                    {/* User Section */}
                    <div className="border-t border-gray-800 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-300 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <Link
                                href={route('profile.edit')}
                                className="flex items-center space-x-2 px-2 py-1.5 text-xs text-gray-400 rounded hover:bg-gray-800/50 hover:text-gray-200 transition"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Profiel</span>
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full flex items-center space-x-2 text-left px-2 py-1.5 text-xs text-gray-400 rounded hover:bg-gray-800/50 hover:text-red-400 transition"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Uitloggen</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="bg-[#16181f] border-b border-gray-800 sticky top-0 z-30">
                    <div className="flex items-center justify-between h-14 px-6 gap-6">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white transition flex-shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        {/* Header content - takes full width */}
                        {header && <div className="flex-1 min-w-0">{header}</div>}

                        <div className="flex items-center space-x-3 flex-shrink-0">
                            <Link
                                href="/"
                                target="_blank"
                                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition rounded-lg hover:bg-gray-800/50"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span>Website</span>
                            </Link>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#0f1117]">
                    {children}
                </main>
            </div>

            {/* Flash Toast */}
            {flashVisible && (flash?.success || flash?.error) && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium transition-all duration-300 ${
                    flash?.success
                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                        : 'bg-red-500 text-white shadow-red-500/30'
                }`}>
                    <span>{flash?.success ? '✓' : '✕'}</span>
                    <span>{flash?.success ?? flash?.error}</span>
                    <button onClick={() => setFlashVisible(false)} className="ml-2 opacity-80 hover:opacity-100">✕</button>
                </div>
            )}
        </div>
    );
}
