import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '', isAdmin = false }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    const headerStyle = isAdmin ? 'text-xl font-medium text-white' : 'text-lg font-medium text-gray-900';
    const subHeaderStyle = isAdmin ? 'mt-1 text-sm text-gray-300' : 'mt-1 text-sm text-gray-600';
    const dangerButtonStyle = isAdmin 
        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-red-500'
        : '';

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    {isAdmin && <span className="text-2xl">⚠️</span>}
                    <h2 className={headerStyle}>
                        {isAdmin ? 'Account Verwijderen' : 'Delete Account'}
                    </h2>
                </div>

                {isAdmin ? (
                    <div className="space-y-3">
                        <p className={subHeaderStyle}>
                            <strong className="text-red-400">Let op:</strong> Als admin account verwijder je hiermee ook je volledige beheeraccent voor "De Ongeplande Route".
                        </p>
                        <p className="text-sm text-gray-400">
                            Alle content blijft bestaan, maar je verliest toegang tot het admin panel. Deze actie kan niet ongedaan gemaakt worden.
                        </p>
                    </div>
                ) : (
                    <p className={subHeaderStyle}>
                        Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                    </p>
                )}
            </header>

            {isAdmin ? (
                <button
                    onClick={confirmUserDeletion}
                    className={dangerButtonStyle}
                >
                    <div className="flex items-center gap-2">
                        <span>🗑️</span>
                        Admin Account Verwijderen
                    </div>
                </button>
            ) : (
                <DangerButton onClick={confirmUserDeletion}>
                    Delete Account
                </DangerButton>
            )}

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className={`p-6 ${isAdmin ? 'bg-gray-800' : ''}`}>
                    <h2 className={`text-lg font-medium ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
                        {isAdmin 
                            ? '🚨 Weet je zeker dat je je admin account wilt verwijderen?'
                            : 'Are you sure you want to delete your account?'
                        }
                    </h2>

                    <p className={`mt-3 text-sm ${isAdmin ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isAdmin 
                            ? 'Dit verwijdert permanent je admin toegang tot "De Ongeplande Route". Alle content blijft bestaan, maar je kunt niet meer inloggen. Voer je wachtwoord in om te bevestigen.'
                            : 'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.'
                        }
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        {isAdmin ? (
                            <input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-3/4 px-4 py-3 bg-gray-700 border border-red-500 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                autoFocus
                                placeholder="Wachtwoord ter bevestiging"
                            />
                        ) : (
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="Password"
                            />
                        )}

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        {isAdmin ? (
                            <>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                                >
                                    Annuleren
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Verwijderen...
                                        </div>
                                    ) : (
                                        'Account Definitief Verwijderen'
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <SecondaryButton onClick={closeModal}>
                                    Cancel
                                </SecondaryButton>

                                <DangerButton className="ms-3" disabled={processing}>
                                    Delete Account
                                </DangerButton>
                            </>
                        )}
                    </div>
                </form>
            </Modal>
        </section>
    );
}
