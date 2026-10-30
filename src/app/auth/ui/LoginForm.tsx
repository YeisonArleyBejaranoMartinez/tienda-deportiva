'use client';
import Link from "next/link"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from "clsx";

export const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage(undefined);

        const formData = new FormData(e.currentTarget);

        const result = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });

        setIsPending(false);

        if (result?.error) {
            setErrorMessage('Credenciales incorrectas');
            return;
        }

        router.push(callbackUrl);
        router.refresh();
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="email">Correo electrónico</label>
        <input
          className="w-full px-5 py-2 border bg-gray-200 rounded mb-5"
          type="email"
          name="email"
        />

        <label htmlFor="email">Contraseña</label>
        <input
          className="w-full px-5 py-2 border bg-gray-200 rounded mb-5"
          type="password"
          name="password"
        />

        <button
          className={clsx("btn-primary w-full", { "cursor-not-allowed opacity-70": isPending })}
          disabled={isPending}
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        {errorMessage && (
          <p className="text-center w-full h-5 text-red-500">{errorMessage}</p>
        )}

        <Link href="./new-account" className="btn-secondary text-center">
          Crear una nueva cuenta
        </Link>
    </form>
  )
}
