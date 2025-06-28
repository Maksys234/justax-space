// app/auth/page.tsx
'use client';

import { useState } from 'react';
// ИЗМЕНЕНИЕ ЗДЕСЬ: Используем относительный путь вместо псевдонима
import { createClient } from '../../lib/supabase/client'; 
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient(); 

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      alert('Registration successful! Please check your email to verify your account.');
      setIsLogin(true);
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/start');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#00001a]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-[#0a0f2c]">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#0a0f2c] text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8S109.8 11.6 244 11.6C303.4 11.6 355.6 33.4 394.8 67.4L337.3 125.1C313.7 103.9 283.5 90.9 244 90.9c-73.4 0-135.2 55.9-152.1 128.4h150.3v-70.1H98.9c-1.3 7.8-2.3 15.6-2.3 23.5 0 23.5 6.8 45.4 18.5 64.4h129.2v70.1H116.3c22.8 69.1 88.6 118.4 164.7 118.4 43.1 0 81.3-17.2 108.9-45.4l58.9 56.4c-45.4 42.1-104.2 67.2-171.8 67.2C109.2 512 0 402.8 0 261.8S109.2 11.6 244 11.6c67.3 0 127.3 24.3 172.4 67.4l-58.6 56.4C344.8 123.6 303.4 111.6 244 111.6c-73.4 0-135.2 55.9-152.1 128.4h150.3V261.8H488z"
              ></path>
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="text-sm text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="font-medium text-cyan-600 hover:text-cyan-500"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}