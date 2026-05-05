import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginAux() {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/login/aux", {
        codigo_acceso: codigo,
        password: password,
      });
      if (res.data.data.rol === "AUXILIAR") {
        navigate("/aux");
      } else {
        alert("No eres auxiliar");
      }
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.message);
      alert("Error real, revisa consola");
    }
  };

  return (
    <div className="h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-2">
          Bienvenido usuario
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Ingrese su código de acceso
        </p>

        {/* 🔥 FORM REAL */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* CODIGO */}
          <input
            type="text"
            placeholder="Código de acceso"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
