import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Inloggen" />
            
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Beautiful Animal Photo */}
                <div className="hidden lg:block relative bg-warm-brown overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80"
                        alt="Lion in nature"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/40 to-black/60" />
                    
                    {/* Overlay Text */}
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <h1 className="font-serif text-5xl mb-4 leading-tight">De Ongeplande Route</h1>
                        <p className="text-lg opacity-90 mb-2">Geen plan. Wel verhalen.</p>
                        <p className="text-sm opacity-75">Beheer je uitjes en ontdekkingen</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex items-center justify-center p-8 bg-warm-bg">
                    <div className="w-full max-w-md">
                        {/* Logo/Title for mobile */}
                        <div className="text-center mb-8 lg:hidden">
                            <h1 className="font-serif text-4xl text-warm-brown mb-2">De Ongeplande Route</h1>
                            <p className="text-sm text-warm-brown/60">Geen plan. Wel verhalen.</p>
                        </div>

                        {/* Login Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif text-warm-brown mb-2">Welkom terug</h2>
                                <p className="text-sm text-warm-brown/60">Log in om je content te beheren</p>
                            </div>

                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="email" value="E-mailadres" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-2 block w-full"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@deongeplande-route.nl"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Wachtwoord" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-2 block w-full"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="ms-2 text-sm text-warm-brown/70">
                                            Onthoud mij
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-warm-brown/70 hover:text-warm-brown underline transition-colors"
                                        >
                                            Vergeten?
                                        </Link>
                                    )}
                                </div>

                                <PrimaryButton 
                                    className="w-full justify-center bg-warm-brown hover:bg-warm-brown/90 focus:bg-warm-brown py-3" 
                                    disabled={processing}
                                >
                                    {processing ? 'Bezig met inloggen...' : 'Inloggen'}
                                </PrimaryButton>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href="/" className="text-sm text-warm-brown/70 hover:text-warm-brown transition-colors">
                                    ← Terug naar website
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
