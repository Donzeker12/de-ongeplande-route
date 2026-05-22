import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-warm-bg pt-6 sm:justify-center sm:pt-0">
            <div className="mb-8">
                <Link href="/" className="text-center">
                    <h1 className="font-serif text-4xl text-warm-brown mb-2 tracking-tight">de ongeplande route</h1>
                    <p className="text-xs uppercase tracking-[0.3em] text-warm-brown/60">Geen plan. Wel verhalen.</p>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-8 py-8 shadow-lg sm:max-w-md sm:rounded-2xl border border-warm-gray/20">
                {children}
            </div>
        </div>
    );
}
