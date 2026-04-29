import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Bot,
  ShoppingCart,
  Calendar,
  User,
  FileText,
  Table,
  Layers,
  ChevronDown,
  MessageCircle,
  Headphones,
  Mail,
  BarChart3,
  Puzzle,
  ShieldCheck,
  Search,
  Menu,
  Bell,
  Moon,
  Settings,
} from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
export default function Admin() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<"dashboard" | "auxiliares">("dashboard");
  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<"admin" | "aux">("admin");
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [auxiliares, setAuxiliares] = useState<any[]>([]);
  const auxSchema = z.object({
    nombre_completo: z.string().min(3, "Mínimo 3 caracteres"),
    codigo_acceso: z.string().min(3, "Código requerido"),
    password: z.string().min(4, "Mínimo 4 caracteres"),
  });

  type AuxForm = z.infer<typeof auxSchema>;
  useEffect(() => {
    const handleClickOutside = () => setOpenUserMenu(false);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  useEffect(() => {
    const fetchAuxiliares = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auxiliares");
        setAuxiliares(res.data.data); // 👈 importante
      } catch (error) {
        console.error("Error al cargar auxiliares", error);
      }
    };

    fetchAuxiliares();
  }, []);
  const auxiliaresActivos = auxiliares.filter(
    (a) => a.estado === "ACTIVO"
  ).length;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuxForm>({
    resolver: zodResolver(auxSchema),
  });
  const crearAuxiliar = async (data: AuxForm) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auxiliares",
        data
      );

      console.log(res.data);
      alert("Auxiliar creado");

      reset(); // 🔥 limpia formulario
    } catch (error) {
      console.error(error);
      alert("Error");
    }
  };
  const adminSchema = z.object({
    nombre: z.string().min(3),
    apellido: z.string().min(3),
    ci: z.string().min(5),
    telefono: z.string().min(7),
    codigo_acceso: z.string().min(3),
    password: z.string().min(4),
  });
  type AdminForm = z.infer<typeof adminSchema>;

  const {
    register: registerAdmin,
    handleSubmit: handleSubmitAdmin,
    formState: { errors: errorsAdmin },
    reset: resetAdmin,
  } = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
  });
  const crearAdmin = async (data: AdminForm) => {
    try {
      await axios.post("http://localhost:3000/api/admin", data);
      alert("Admin creado");
      resetAdmin();
    } catch (error) {
      alert("Error");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-blue-600 mb-6">
              Panel administrativo
            </h1>

            <p className="text-xs text-gray-400 mb-2 px-2">MENÚ</p>

            <button
              onClick={() => toggleMenu("Panel de Control")}
              className="flex items-center cursor-pointer justify-between w-full px-3 py-2 rounded-lg bg-blue-100 text-black font-medium"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard size={18} />
                Panel de Control
              </div>
              <ChevronDown
                size={16}
                className={`${
                  openMenu === "Panel de Control" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "Panel de Control" && (
              <div className="ml-8 mt-2 flex flex-col gap-1">
                <button
                  onClick={() => setShowModal(true)}
                  className="text-left text-sm px-2 py-1 rounded bg-blue-100 text-blue-700"
                >
                  Usuarios (Admin / Aux)
                </button>
                <button className="text-left text-sm px-2 py-1 rounded hover:bg-gray-100">
                  Asistencias
                </button>
                <button className="text-left text-sm px-2 py-1 rounded hover:bg-gray-100">
                  Laboratorios
                </button>
              </div>
            )}
            <div className="mt-3 space-y-1">
              <MenuItem
                icon={<Bot size={18} />}
                text="IA Reportes Inteligentes"
                badge
              />
              <MenuItem icon={<ShoppingCart size={18} />} text="Incidencias" />
              <MenuItem
                icon={<Calendar size={18} />}
                text="Revisiones por turno"
              />
              <button
                onClick={() =>
                  setView(view === "auxiliares" ? "dashboard" : "auxiliares")
                }
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer transition ${
                  view === "auxiliares"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <User size={18} />
                Gestión de auxiliares
              </button>

              <Dropdown icon={<FileText size={18} />} text="Reportes diarios" />
              <Dropdown icon={<Table size={18} />} text="Equipos" />
              <Dropdown
                icon={<Layers size={18} />}
                text="Movimientos de equipos"
              />
            </div>

            <p className="text-xs text-gray-400 mt-6 mb-2 px-2">SOPORTE</p>
            <MenuItem icon={<MessageCircle size={18} />} text="Chat interno" />
            <MenuItem
              icon={<Headphones size={18} />}
              text="Soporte técnico"
              badge
            />
            <Dropdown icon={<Mail size={18} />} text="Notificaciones" />

            <p className="text-xs text-gray-400 mt-6 mb-2 px-2">OTROS</p>
            <Dropdown
              icon={<BarChart3 size={18} />}
              text="Estadísticas del sistema"
            />
            <Dropdown icon={<Puzzle size={18} />} text="Configuración" />
            <Dropdown icon={<ShieldCheck size={18} />} text="Seguridad" />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="font-semibold text-sm">
              Sistema de Laboratorios ICEPAL
            </p>
            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Ver reportes
            </button>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="bg-white px-6 py-4 flex justify-between items-center ">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-80">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios, equipos..."
                className="bg-transparent outline-none ml-2 text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Moon size={20} />
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUserMenu(!openUserMenu);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                {/* AVATAR */}
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="admin"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                {/* INFO */}
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-gray-800">
                    Administrador
                  </p>
                  <p className="text-xs text-gray-500">Admin principal</p>
                </div>

                {/* ICONO */}
                <ChevronDown
                  size={16}
                  className={`transition ${
                    openUserMenu ? "rotate-180 text-blue-600" : "text-gray-400"
                  }`}
                />
              </button>

              {/* DROPDOWN PRO */}
              {openUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  {/* HEADER */}
                  <div className="px-4 py-3 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">
                      Administrador
                    </p>
                    <p className="text-xs text-gray-500">admin@icepal.com</p>
                  </div>

                  {/* OPCIONES */}
                  <div className="p-2 space-y-1">
                    <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                      <User size={16} /> Perfil
                    </button>

                    <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                      <Settings size={16} /> Configuración
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 overflow-y-auto">
          {/* ================= DASHBOARD ================= */}
          {view === "dashboard" && (
            <div className="space-y-6">
              {/* CARDS */}
              <div className="grid grid-cols-3 gap-6">
                <Card title="Auxiliares activos" value={auxiliaresActivos} />
                <Card title="Equipos operativos" value="45" />

                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-gray-500">Incidencias de la semana</h3>

                  <div className="flex justify-center items-center h-40">
                    <div className="w-32 h-32 rounded-full border-8 border-blue-500 border-t-gray-200 flex items-center justify-center text-xl font-bold">
                      12
                    </div>
                  </div>

                  <p className="text-sm text-center text-gray-500 mt-2">
                    Incidencias registradas
                  </p>
                </div>
              </div>

              {/* GRAFICO */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-gray-500 mb-4">Incidencias por día</h3>

                <div className="flex items-end gap-3 h-40">
                  {[5, 8, 4, 6, 3, 7, 9].map((h, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 w-6 rounded"
                      style={{ height: `${h * 10}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* STATISTICS */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-gray-500 mb-4">Estado de equipos</h3>

                <div className="h-40 flex items-end">
                  <div className="w-full h-2 bg-blue-300 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* ================= AUXILIARES ================= */}
          {view === "auxiliares" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gestión de Auxiliares</h2>

                <button
                  onClick={() => setView("dashboard")}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200"
                >
                  ← Volver
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-3">Usuario</th>
                      <th>Código</th>
                      <th>Fecha ingreso</th>
                      <th>Finaliza</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {auxiliares.map((aux) => {
                      const fechaInicio = new Date(aux.fecha_creacion);
                      const fechaFin = new Date(fechaInicio);
                      fechaFin.setMonth(fechaFin.getMonth() + 3);

                      return (
                        <tr
                          key={aux.id_usuario}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          {/* USUARIO */}
                          <td className="py-3 flex items-center gap-3">
                            <img
                              src={`https://i.pravatar.cc/150?u=${aux.id_usuario}`}
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="font-medium">
                              {aux.nombre_completo}
                            </span>
                          </td>

                          {/* CODIGO */}
                          <td>{aux.codigo_acceso}</td>

                          {/* FECHA INICIO */}
                          <td>{fechaInicio.toLocaleDateString()}</td>

                          {/* FECHA FIN */}
                          <td>{fechaFin.toLocaleDateString()}</td>

                          {/* ESTADO */}
                          <td>
                            <button
                              onClick={async () => {
                                await axios.patch(
                                  `http://localhost:3000/api/auxiliares/${aux.id_usuario}`
                                );

                                const res = await axios.get(
                                  "http://localhost:3000/api/auxiliares"
                                );

                                setAuxiliares(res.data.data);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                                aux.estado === "ACTIVO"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-600 hover:bg-red-200"
                              }`}
                            >
                              {aux.estado}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[700px] rounded-xl shadow-lg p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Gestión de usuarios</h2>
              <button onClick={() => setShowModal(false)} className="cursor-pointer">✖</button>
            </div>

            {/* TABS */}
            <div className="flex gap-4 mb-6 border-b pb-2">
              <button
                onClick={() => setTab("admin")}
                className={`px-3 py-1 rounded ${
                  tab === "admin" ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"
                }`}
              >
                Administrador
              </button>

              <button
                onClick={() => setTab("aux")}
                className={`px-3 py-1 rounded ${
                  tab === "aux" ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"
                }`}
              >
                Auxiliar
              </button>
            </div>

            {/* FORM ADMIN */}
            {tab === "admin" && (
              <form
                onSubmit={handleSubmitAdmin(crearAdmin)}
                className="grid grid-cols-2 gap-4"
              >
                {/* NOMBRE */}
                <div>
                  <input
                    {...registerAdmin("nombre")}
                    className="border p-2 rounded w-full"
                    placeholder="Nombre"
                  />
                  {errorsAdmin.nombre && (
                    <p className="text-red-500 text-sm">
                      {errorsAdmin.nombre.message}
                    </p>
                  )}
                </div>

                {/* APELLIDO */}
                <div>
                  <input
                    {...registerAdmin("apellido")}
                    className="border p-2 rounded w-full"
                    placeholder="Apellido"
                  />
                  {errorsAdmin.apellido && (
                    <p className="text-red-500 text-sm">
                      {errorsAdmin.apellido.message}
                    </p>
                  )}
                </div>

                {/* CI */}
                <div>
                  <input
                    {...registerAdmin("ci")}
                    className="border p-2 rounded w-full"
                    placeholder="CI"
                  />
                  {errorsAdmin.ci && (
                    <p className="text-red-500 text-sm">
                      {errorsAdmin.ci.message}
                    </p>
                  )}
                </div>

                {/* TELEFONO */}
                <div>
                  <input
                    {...registerAdmin("telefono")}
                    className="border p-2 rounded w-full"
                    placeholder="Teléfono"
                  />
                  {errorsAdmin.telefono && (
                    <p className="text-red-500 text-sm">
                      {errorsAdmin.telefono.message}
                    </p>
                  )}
                </div>

                {/* CODIGO */}
                <div className="col-span-2">
                  <input
                    {...registerAdmin("codigo_acceso")}
                    className="border p-2 rounded w-full"
                    placeholder="Código acceso"
                  />
                  {errorsAdmin.codigo_acceso && (
                    <p className="text-red-500 text-sm">
                      {errorsAdmin.codigo_acceso.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="col-span-2">
                  <input
                    type="password"
                    {...registerAdmin("password")}
                    className="border p-2 rounded w-full"
                    placeholder="Contraseña"
                  />
                  {errorsAdmin.password && (
                    <p className="text-red-500 text-sm">
                      {errorsAdmin.password.message}
                    </p>
                  )}
                </div>

                <button className="col-span-2 bg-blue-600 text-white py-2 rounded cursor-pointer">
                  Crear Administrador
                </button>
              </form>
            )}

            {/* FORM AUX */}
            {tab === "aux" && (
              <form
                onSubmit={handleSubmit(crearAuxiliar)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="col-span-2">
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Nombre completo"
                    {...register("nombre_completo")}
                  />
                  {errors.nombre_completo && (
                    <p className="text-red-500 text-sm">
                      {errors.nombre_completo.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Código acceso"
                    {...register("codigo_acceso")}
                  />
                  {errors.codigo_acceso && (
                    <p className="text-red-500 text-sm">
                      {errors.codigo_acceso.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <input
                    type="password"
                    className="border p-2 rounded w-full"
                    placeholder="Contraseña"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button className="col-span-2 bg-blue-600 text-white py-2 rounded">
                  Crear Auxiliar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTES */

function MenuItem({ icon, text, badge }: any) {
  return (
    <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100">
      <div className="flex items-center gap-2">
        {icon}
        {text}
      </div>
      {badge && (
        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
          NUEVO
        </span>
      )}
    </button>
  );
}

function Dropdown({ icon, text }: any) {
  return (
    <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100">
      <div className="flex items-center gap-2">
        {icon}
        {text}
      </div>
      <ChevronDown size={16} />
    </button>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
