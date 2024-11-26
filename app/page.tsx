'use client';
import { useState } from "react";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Home() {
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);
  return (
    <>
      <section className="bg-gray-300 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900">

            ISTEAH
          </div>
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Connectez-vous à votre compte
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Votre email</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      className="pl-10 pr-4 py-2 w-full bg-gray-100 text-black rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    <AiOutlineMail className="absolute top-3 left-3 text-gray-500" />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      placeholder="Mot de passe"
                      name="password"
                      className="pl-10 pr-4 py-2 w-full bg-gray-100 text-black rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <AiOutlineLock className="absolute top-3 left-3 text-gray-500" />
                    <button
                      type="button"
                      onClick={handleClick}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {show ? <FaEyeSlash  className="text-gray-500"/> : <FaEye  className="text-gray-500"/>}
                    </button>
                  </div>

                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-900 ">Se souvenir de moi</label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-gray-900 hover:underline">Mot de passe oublié ?</a>
                </div>
                <button type="submit" className="w-full rounded-md bg-indigo-500 py-2 px-4 text-white font-medium hover:bg-indigo-600">Se Connecter</button>
                <p className="text-sm font-light text-gray-500">
                Vous n’avez pas encore de compte ?  <a href="#" className="font-medium text-black hover:underline">Inscrivez-vous</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
