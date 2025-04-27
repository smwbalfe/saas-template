"use client"
import { useState } from 'react';
import { supabaseBrowserClient } from '@/src/lib/supabase/client';
import {useRouter} from 'next/navigation';

const PasswordReset = () => {

    const router = useRouter()

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabaseBrowserClient.auth.updateUser({ password });
            if (error) throw error;
            setMessage('Password updated successfully!');
            await supabaseBrowserClient.auth.signOut()
            router.push('/auth');
            setPassword('');
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Reset Your Password</h2>

            <form onSubmit={handlePasswordReset}>
                <div>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {message && <p>{message}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

export default PasswordReset;