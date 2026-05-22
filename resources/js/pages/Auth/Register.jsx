import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registreren" />
            
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Beautiful Animal Photo */}
                <div className="hidden lg:block relative bg-warm-brown overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&q=80"
                        alt="Elephant family"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/40 to-black/60" />
                    
                    {/* Overlay Text */}
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <h1 className="font-serif text-5xl mb-4 leading-tight">De Ongeplande Route</h1>
                        <p className="text-lg opacity-90 mb-2">Geen plan. Wel verhalen.</p>
                        <p className="text-sm opacity-75">Deel je avonturen met de wereld</p>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="flex items-center justify-center p-8 bg-warm-bg">
                    <div className="w-full max-w-md">
                        {/* Logo/Title for mobile */}
                        <div className="text-center mb-8 lg:hidden">
                            <h1 className="font-serif text-4xl text-warm-brown mb-2">De Ongeplande Route</h1>
                            <p className="text-sm text-warm-brown/60">Geen plan. Wel verhalen.</p>
                        </div>

                        {/* Register Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif text-warm-brown mb-2">Account Aanmaken</h2>
                                <p className="text-sm text-warm-brown/60">Begin met het delen van je verhalen</p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <InputLabel htmlFor="name" value="Naam" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-2 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="E-mailadres" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-2 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
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
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Bevestig Wachtwoord"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-2 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <PrimaryButton 
                                    className="w-full justify-center bg-warm-brown hover:bg-warm-brown/90 focus:bg-warm-brown py-3" 
                                    disabled={processing}
                                >
                                    {processing ? 'Account aanmaken...' : 'Registreren'}
                                </PrimaryButton>
                            </form>

                            <div className="mt-6 text-center space-y-3">
                                <Link 
                                    href={route('login')} 
                                    className="text-sm text-warm-brown/70 hover:text-warm-brown transition-colors"
                                >
                                    Heb je al een account? <span className="underline">Inloggen</span>
                                </Link>
                                
                                <div>
                                    <Link href="/" className="text-sm text-warm-brown/70 hover:text-warm-brown transition-colors">
                                        ← Terug naar website
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
