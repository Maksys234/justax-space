// app/login/page.tsx

'use client'; // Обязательно для страниц с интерактивом (useState, onClick)

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient'; // Импортируем наш "мост"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Для перенаправления после входа
  const supabase = createClient(); // Создаем экземпляр клиента Supabase

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

    // Используем Supabase для входа пользователя
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Если есть ошибка, показываем ее пользователю
      alert(`Ошибка входа: ${error.message}`);
    } else {
      // Если вход успешен
      alert('Вход выполнен успешно!');
      // Перенаправляем пользователя на главную страницу
      router.push('/');
      router.refresh(); // Обновляем страницу, чтобы сервер узнал о новой сессии
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Вход в Justax.space</h1>
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}