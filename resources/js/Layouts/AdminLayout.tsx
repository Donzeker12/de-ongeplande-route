import { PropsWithChildren, ReactNode, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface AdminLayoutProps extends PropsWithChildren {
    header?: ReactNode;
}

export default function AdminLayout({ children, header }: AdminLayoutProps) {
    const user = usePage<{ auth: { user: User } }>().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900">
            <Head title="CMS Admin" />
            
            {/* Navigation */}
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/admin/dashboard" className="text-white font-bold text-xl">
                                    🎛️ CMS Admin
                                </Link>
                            </div>

                            {/* Primary Navigation Menu */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href="/admin/dashboard"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/quick-capture"
                                    className="border-transparent text-green-300 hover:text-green-200 hover:border-green-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    📸 Quick Capture
                                </Link>
                                <Link
                                    href="/admin/outings"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Uitjes
                                </Link>
                                <Link
                                    href="/admin/discoveries"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Ontdekkingen
                                </Link>
                                <Link
                                    href="/admin/stories"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    📝 Verhalen
                                </Link>
                                <Link
                                    href="/admin/venues"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Locaties
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Categorieën
                                </Link>
                                <Link
                                    href="/admin/media"
                                    className="border-transparent text-sky-300 hover:text-sky-200 hover:border-sky-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    🖼️ Media
                                </Link>
                                <Link
                                    href="/admin/users"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Gebruikers
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="border-transparent text-violet-300 hover:text-violet-200 hover:border-violet-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    ⚙️ Site Instellingen
                                </Link>
                            </div>
                        </div>

                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300">{user.name}</span>
                                    <Link
                                        href="/profile"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                                    >
                                        👤 Profiel
                                    </Link>
                                    <Link
                                        href="/"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        🏠 Website
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/admin/dashboard"
                            className="border-transparent text-gray-300 hover:text-white hover:bg-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/quick-capture"
                            className="border-transparent text-green-300 hover:text-green-200 hover:bg-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            📸 Quick Capture
                        </Link>
                        <Link
                            href="/admin/outings"
                            className="border-transparent text-gray-300 hover:text-white hover:bg-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Uitjes
                        </Link>
                        <Link
                            href="/admin/discoveries"
                            className="border-transparent text-gray-300 hover:text-white hover:bg-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Ontdekkingen
                        </Link>
                        <Link
                            href="/admin/stories"
                            className="border-transparent text-gray-300 hover:text-white hover:bg-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            📝 Verhalen
                        </Link>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-700">
                        <div className="px-4">
                            <div className="font-medium text-base text-white">{user.name}</div>
                            <div className="font-medium text-sm text-gray-400">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                                👤 Profiel
                            </Link>
                            <Link
                                href="/"
                                className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                                Website
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Heading */}
            {header && (
                <header className="bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <div className="text-white">
                                {header}
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className="bg-gray-900 min-h-screen">
                {children}
            </main>
        </div>
    );
}