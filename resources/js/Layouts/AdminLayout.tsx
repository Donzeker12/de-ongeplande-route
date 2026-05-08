import { PropsWithChildren, ReactNode, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { User } from '@/types';

interface AdminLayoutProps extends PropsWithChildren {
    header?: ReactNode;
}

interface SidebarProps {
    currentPath: string;
    userName: string;
    userEmail: string;
    uploading: boolean;
    uploadSuccess: string | null;
    uploadError: string | null;
    isDragging: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: () => void;
    onDragLeave: () => void;
}

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '🎛️', color: 'text-gray-300' },
    { href: '/admin/quick-capture', label: 'Quick Capture', icon: '📸', color: 'text-green-400' },
    { href: '/admin/outings', label: 'Uitjes', icon: '🗺️', color: 'text-gray-300' },
    { href: '/admin/discoveries', label: 'Ontdekkingen', icon: '🔍', color: 'text-gray-300' },
    { href: '/admin/stories', label: 'Verhalen', icon: '📝', color: 'text-gray-300' },
    { href: '/admin/venues', label: 'Locaties', icon: '📍', color: 'text-gray-300' },
    { href: '/admin/categories', label: 'Categorieën', icon: '🏷️', color: 'text-gray-300' },
    { href: '/admin/users', label: 'Gebruikers', icon: '👥', color: 'text-gray-300' },
    { href: '/admin/settings', label: 'Instellingen', icon: '⚙️', color: 'text-violet-400' },
];

function SidebarContent({
    currentPath,
    userName,
    userEmail,
    uploading,
    uploadSuccess,
    uploadError,
    isDragging,
    fileInputRef,
    onFileChange,
    onDrop,
    onDragOver,
    onDragLeave,
}: SidebarProps) {
    return (
        <div className="w-60 bg-[#16181f] border-r border-gray-800/60 flex flex-col h-full">
            {/* Logo */}
            <div className="px-4 py-4 border-b border-gray-800/60">
                <Link href="/admin/dashboard" className="text-white font-bold text-base flex items-center gap-2">
                    🎛️ <span>CMS Admin</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const active = currentPath.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                active ? 'bg-gray-700/70 text-white' : `${item.color} hover:bg-gray-800 hover:text-white`
                            }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                <div className="pt-1">
                    <Link
                        href="/admin/media"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPath.startsWith('/admin/media')
                                ? 'bg-sky-900/50 text-sky-300'
                                : 'text-sky-400 hover:bg-sky-900/30 hover:text-sky-300'
                        }`}
                    >
                        <span className="text-base">🖼️</span>
                        <span>Media Bibliotheek</span>
                    </Link>
                </div>
            </nav>

            {/* Quick upload */}
            <div className="px-3 pb-3 border-t border-gray-800/60 pt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Snel uploaden</p>
                <div
                    onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors select-none ${
                        isDragging
                            ? 'border-sky-500 bg-sky-900/20'
                            : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
                    }`}
                >
                    {uploading ? (
                        <p className="text-xs text-sky-400 flex items-center justify-center gap-1.5">
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Uploaden...
                        </p>
                    ) : uploadSuccess ? (
                        <p className="text-xs text-emerald-400 font-medium">✓ {uploadSuccess}</p>
                    ) : uploadError ? (
                        <p className="text-xs text-red-400">{uploadError}</p>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <p className="text-xs text-gray-500">Sleep of klik</p>
                        </>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>

            {/* User */}
            <div className="px-3 pb-3 border-t border-gray-800/60 pt-3">
                <div className="flex items-center gap-2 px-1 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Link href="/" className="flex-1 text-center text-xs text-gray-400 hover:text-white py-1.5 rounded hover:bg-gray-800 transition-colors">
                        🏠 Site
                    </Link>
                    <Link href="/profile" className="flex-1 text-center text-xs text-gray-400 hover:text-white py-1.5 rounded hover:bg-gray-800 transition-colors">
                        👤 Profiel
                    </Link>
                    <Link href="/logout" method="post" as="button" className="flex-1 text-center text-xs text-gray-400 hover:text-red-400 py-1.5 rounded hover:bg-gray-800 transition-colors w-full">
                        Logout
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AdminLayout({ children, header }: AdminLayoutProps) {
    const { auth, url: currentPath } = usePage<{ auth: { user: User }; url: string }>().props;
    const user = auth.user;
    const pageUrl = usePage().url;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(null);
        const formData = new FormData();
        formData.append('image', file);
        try {
            await axios.post('/admin/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadSuccess('Opgeslagen!');
            setTimeout(() => setUploadSuccess(null), 3000);
        } catch {
            setUploadError('Upload mislukt');
            setTimeout(() => setUploadError(null), 3000);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            uploadFile(file);
        }
    };

    const sidebarProps: SidebarProps = {
        currentPath: pageUrl,
        userName: user.name,
        userEmail: user.email,
        uploading,
        uploadSuccess,
        uploadError,
        isDragging,
        fileInputRef,
        onFileChange: handleFileChange,
        onDrop: handleDrop,
        onDragOver: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
    };

    return (
        <div className="min-h-screen bg-[#0d0f14] flex">
            <Head title="CMS Admin" />

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0 sticky top-0 h-screen">
                <SidebarContent {...sidebarProps} />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 z-50 flex">
                        <SidebarContent {...sidebarProps} />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center h-14 px-4 bg-[#16181f] border-b border-gray-800 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-400 hover:text-white mr-3 p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link href="/admin/dashboard" className="text-white font-bold">
                        🎛️ CMS Admin
                    </Link>
                </div>

                {/* Page heading */}
                {header && (
                    <header className="bg-[#16181f] border-b border-gray-800 px-6 py-4">
                        <div className="text-white">{header}</div>
                    </header>
                )}

                {/* Page content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}