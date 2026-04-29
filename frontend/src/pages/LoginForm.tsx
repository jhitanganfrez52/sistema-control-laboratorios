import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/login/admin", {
        codigo_acceso: codigo,
        password: password,
      });

      const rol = res.data.data.rol; // 🔥 FIX

      if (rol === "ADMINISTRADOR") {
        navigate("/admin");
      } else if (rol === "AUXILIAR") {
        navigate("/aux");
      }
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        Iniciar Sesión
      </h2>

      <form onSubmit={handleLogin} className="mt-8 space-y-5">
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded">
          Acceder
        </button>
      </form>
    </div>
  );
}
