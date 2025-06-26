// app/start/page.tsx
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import Link from 'next/link'; // Убедимся что Link импортирован, хотя он здесь не используется напрямую в JSX

export default async function StartPage() {
    const supabase = createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Если пользователя нет (не аутентифицирован), перенаправляем на страницу входа
    if (!user) {
        redirect('/auth');
    }

    // Server Action для выхода из системы
    const handleLogout = async () => {
        "use server";
        const supabase = createSupabaseServerClient();
        await supabase.auth.signOut();
        redirect('/auth'); // Перенаправляем на страницу входа после выхода
    };

    return (
        <div className="flex flex-col items-center p-8 w-full min-h-screen bg-gray-50 dark:bg-gray-900">
             <header className="w-full max-w-5xl flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Justax.space</h1>
                <div className="flex items-center gap-4">
                     <span className="text-sm text-gray-700 dark:text-gray-300">
                       Привет, {user.email}
                     </span>
                     <form action={handleLogout}>
                        <button
                            type="submit"
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Выйти
                        </button>
                    </form>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Добро пожаловать!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Вы успешно вошли в систему. Это ваша стартовая страница.
                </p>
                {/* Здесь будет основной контент вашего приложения */}
            </main>
        </div>
    );
}