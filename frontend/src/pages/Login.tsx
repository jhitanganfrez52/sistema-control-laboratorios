import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Eye, EyeOff } from "lucide-react";
const loginSchema = z.object({
  codigo_acceso: z.string().min(1, "El código es obligatorio"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(4, "Mínimo 4 caracteres"),
});
type FormData = z.infer<typeof loginSchema>;
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post("http://localhost:3000/api/login", data, {
        withCredentials: true,
      });
      const rol = res.data.data.rol.nombre;
      if (rol === "ADMINISTRADOR") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/aux", { replace: true });
      }
    } catch (error: any) {
      toastr.error(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {/* CODIGO */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Código"
            {...register("codigo_acceso")}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.codigo_acceso && (
            <p className="text-red-500 text-sm mt-1">
              {errors.codigo_acceso.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              {...register("password")}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-3 rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Ingresando..." : "Acceder"}
        </button>
      </form>
    </div>
  );
}
