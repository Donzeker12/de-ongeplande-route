import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { User } from '@/types';

interface NavigationProps {
    variant?: 'home' | 'page';
    className?: string;
}

export default function Navigation({ variant = 'page', className = '' }: NavigationProps) {
    const { url } = usePage();
    const user = usePage<{ auth: { user: User | null } }>().props.auth?.user ?? null;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const isHome = variant === 'home';
    const isSticky = isHome && isScrolled;
    
    return (
        <nav className={`${isHome ? 'fixed' : 'sticky'} top-0 z-50 w-full transition-all duration-300 ${
            isHome 
                ? isSticky 
                    ? 'glass border-b border-warm-200/20 shadow-soft' 
                    : 'bg-transparent'
                : 'bg-white border-b border-warm-200 shadow-sm'
        } ${className}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16 lg:h-18">
                    {/* Logo */}
                    <Link 
                        href="/" 
                        className={`font-serif text-2xl tracking-tight transition-colors duration-200 ${
                            isHome && !isSticky ? 'text-white hover:text-white/80' : 'text-warm-700 hover:text-warm-600'
                        }`}
                    >
                        de ongeplande route
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink 
                            href="/over-ons" 
                            isActive={url === '/over-ons'}
                            variant={isHome && !isSticky ? 'light' : 'dark'}
                        >
                            Over Ons
                        </NavLink>
                        <NavLink 
                            href="/verhalen" 
                            isActive={url.startsWith('/verhalen')}
                            variant={isHome && !isSticky ? 'light' : 'dark'}
                        >
                            Verhalen
                        </NavLink>
                        {/* Dashboard link voor admins */}
                        {user?.is_admin && (
                            <NavLink
                                href="/admin/dashboard"
                                isActive={url.startsWith('/admin')}
                                variant={isHome && !isSticky ? 'light' : 'dark'}
                            >
                                Dashboard
                            </NavLink>
                        )}
                        
                        {/* CTA Button */}
                        <Link 
                            href="/verhalen" 
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                                isHome && !isSticky 
                                    ? 'bg-white text-warm-700 hover:bg-warm-50 shadow-md hover:shadow-lg' 
                                    : 'bg-warm-700 text-white hover:bg-warm-800 shadow-md hover:shadow-lg'
                            }`}
                        >
                            Verhalen
                        </Link>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            isHome && !isSticky 
                                ? 'text-white hover:bg-white/10' 
                                : 'text-warm-700 hover:bg-warm-100'
                        }`}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle menu"
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className={`px-2 pt-2 pb-6 space-y-2 ${isHome ? 'bg-white/95 backdrop-blur-md rounded-2xl mx-4 mb-4 shadow-lg' : 'border-t border-warm-200 mt-2'}`}>
                            <MobileNavLink href="/over-ons" isActive={url === '/over-ons'}>
                                Over Ons
                            </MobileNavLink>
                            <MobileNavLink href="/verhalen" isActive={url.startsWith('/verhalen')}>
                                Verhalen
                            </MobileNavLink>
                            {user?.is_admin && (
                                <MobileNavLink href="/admin/dashboard" isActive={url.startsWith('/admin')}>
                                    Dashboard
                                </MobileNavLink>
                            )}
                            <div className="pt-2">
                                <Link 
                                    href="/verhalen" 
                                    className="block w-full px-4 py-3 bg-warm-700 text-white text-center rounded-lg font-medium hover:bg-warm-800 transition-colors"
                                >
                                    Verhalen
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

interface NavLinkProps {
    href: string;
    isActive: boolean;
    children: React.ReactNode;
    variant?: 'light' | 'dark';
}

function NavLink({ href, isActive, children, variant = 'dark' }: NavLinkProps) {
    return (
        <Link 
            href={href} 
            className={`text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                variant === 'light'
                    ? isActive 
                        ? 'text-white' 
                        : 'text-white/80 hover:text-white'
                    : isActive 
                        ? 'text-warm-700' 
                        : 'text-warm-600 hover:text-warm-700'
            }`}
        >
            {children}
        </Link>
    );
}

interface MobileNavLinkProps {
    href: string;
    isActive: boolean;
    children: React.ReactNode;
}

function MobileNavLink({ href, isActive, children }: MobileNavLinkProps) {
    return (
        <Link 
            href={href} 
            className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                    ? 'bg-warm-100 text-warm-700' 
                    : 'text-warm-600 hover:bg-warm-50 hover:text-warm-700'
            }`}
        >
            {children}
        </Link>
    );
}