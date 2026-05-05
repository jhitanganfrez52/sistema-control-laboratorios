import logo from "../assets/icepal_logo_transparent.png";
import { useState } from "react";
import LoginForm from "../pages/LoginAdmin";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-12 py-3 bg-white shadow-sm">

        {/* LOGO */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            className="w-24 object-contain hover:scale-105 transition cursor-pointer"
          />

          <div className="flex flex-col leading-tight">
            <h1 className="font-bold text-blue-700 text-lg">
              Instituto Tecnológico ICEPAL
            </h1>

            <span className="text-gray-500 text-xs">
              Panel Administrativo
            </span>
          </div>
        </div>

        {/* NAV */}
        <div className="flex items-center gap-10 text-blue-700 font-medium">
          <button className="hover:text-blue-900 transition cursor-pointer">Inicio</button>
          <button className="hover:text-blue-900 transition cursor-pointer">Funciones</button>
          <button className="hover:text-blue-900 transition cursor-pointer">
            Acceso Administrativo
          </button>
        </div>

        {/* BOTÓN */}
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl shadow hover:scale-105 transition cursor-pointer"
        >
          Iniciar Sesión
        </button>
      </nav>

      {/* MODAL */}
      {open && <LoginModal close={() => setOpen(false)} />}
    </>
  );
}

/* 🔥 COMPONENTE MODAL */
function LoginModal({ close }: { close: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* FONDO */}
      <div
        onClick={close}
        className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/70 to-gray-800/80 backdrop-blur-sm"
      />

      {/* FORM */}
      <div className="relative z-10">
        <LoginForm />
      </div>

    </div>
  );
}