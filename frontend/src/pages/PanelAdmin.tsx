import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Bot,
  ShoppingCart,
  Calendar,
  User,
  Table,
  Layers,
  ChevronDown,
  MessageCircle,
  Headphones,
  ShieldCheck,
  Search,
  Menu,
  Bell,
  Moon,
  Settings,
  Monitor,
} from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/ChatGPT Image 11 may 2026, 11_47_25 p.m..png";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;
export default function Admin() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<
    | "dashboard"
    | "auxiliares"
    | "equipos"
    | "incidencias"
    | "revisiones"
    | "laboratorios"
  >("dashboard");
  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [laboratorios, setLaboratorios] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [tab, setTab] = useState<"admin" | "aux">("admin");
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [auxiliares, setAuxiliares] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [tipoManual, setTipoManual] = useState("");
  const auxSchema = z.object({
    nombre_completo: z
      .string()
      .min(3, "Mínimo 3 caracteres")
      .max(100, "Máximo 100 caracteres"),

    codigo_acceso: z.string().min(3, "Código requerido").max(20),

    password: z.string().min(4, "Mínimo 4 caracteres").max(50),
  });
  type AuxForm = z.infer<typeof auxSchema>;
  useEffect(() => {
    const handleClickOutside = () => setOpenUserMenu(false);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  useEffect(() => {
    const fetchAuxiliares = async () => {
      const res = await axios.get("http://localhost:3000/api/auxiliares");

      setAuxiliares(res.data.data);
    };

    fetchAuxiliares();

    const interval = setInterval(fetchAuxiliares, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/me");

        setAdminData(res.data);
      } catch (error) {
        navigate("/login", { replace: true });
      }
    };

    fetchAdmin(); // inicial

    const interval = setInterval(() => {
      fetchAdmin(); // refresca cada 3-5 segundos
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/laboratorios");

        setLaboratorios(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLabs();

    const interval = setInterval(() => {
      fetchLabs();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/equipos");

        setEquipos(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEquipos();

    const interval = setInterval(() => {
      fetchEquipos();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/incidencias");

        setIncidencias(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    // carga inicial
    fetchIncidencias();

    // actualiza cada 3 segundos
    const interval = setInterval(() => {
      fetchIncidencias();
    }, 3000);

    // limpiar
    return () => clearInterval(interval);
  }, []);
  const auxiliaresActivos = auxiliares.filter(
    (a) => a.estado === "ACTIVO",
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
        data,
      );
      toastr.success("Auxiliar creado");

      reset(); // 🔥 limpia formulario
    } catch (error) {
      console.error(error);
      toastr.error("Error");
    }
  };
  const adminSchema = z.object({
    nombre: z.string().min(3, "Nombre muy corto"),

    apellido: z.string().min(3, "Apellido muy corto"),

    ci: z
      .string()
      .regex(/^[0-9]+$/, "Solo números")
      .min(5, "CI inválido"),

    telefono: z
      .string()
      .regex(/^[0-9]+$/, "Solo números")
      .min(7, "Teléfono inválido"),

    codigo_acceso: z.string().min(3, "Código inválido"),

    password: z.string().min(4, "Mínimo 4 caracteres"),
  });
  type AdminForm = z.infer<typeof adminSchema>;
  const equipmentSchema = z.object({
    codigo_equipo: z.string().min(3, "Código requerido"),

    id_laboratorio: z.string().min(1, "Seleccione laboratorio"),

    tipo: z.string().min(1, "Seleccione tipo"),

    estado: z.string().min(1, "Seleccione estado"),
  });
  type EquipmentForm = z.infer<typeof equipmentSchema>;
  const {
    register: registerEquipment,
    handleSubmit: handleSubmitEquipment,
    formState: { errors: errorsEquipment },
    reset: resetEquipment,
    watch,
  } = useForm<EquipmentForm>({
    resolver: zodResolver(equipmentSchema),
  });
  const watchEquipmentTipo = watch("tipo");
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
      toastr.success("Admin creado");
      resetAdmin();
    } catch (error) {
      toastr.error("Error");
    }
  };
  const obtenerPerfilAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/me");

      setAdminData(res.data);
      setShowProfileModal(true);
    } catch (error) {
      console.error(error);
      toastr.error("Error al cargar perfil");
    }
  };
  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    toastr.info(
      `<div style="display:flex; gap:10px; margin-top:10px;">
      <button id="confirmUpload" style="background:#2563eb;color:white;padding:5px 10px;border-radius:5px;">Aceptar</button>
      <button id="cancelUpload" style="background:#e5e7eb;padding:5px 10px;border-radius:5px;">Cancelar</button>
    </div>`,
      "¿Usar esta imagen?",
      {
        closeButton: true,
        timeOut: 0,
        extendedTimeOut: 0,
        escapeHtml: false, // ✅ CORRECTO (no allowHtml)
        tapToDismiss: false,
        onShown: () => {
          const confirmBtn = document.getElementById("confirmUpload");
          const cancelBtn = document.getElementById("cancelUpload");

          confirmBtn?.addEventListener("click", async () => {
            const url = URL.createObjectURL(file);
            setPreview(url);

            const formData = new FormData();
            formData.append("foto", file);

            try {
              const res = await axios.post(
                `http://localhost:3000/api/upload-photo/${adminData.id_usuario}`,
                formData,
              );

              setAdminData({
                ...adminData,
                foto: res.data.foto,
              });
              // 🔥 volver a cargar auxiliares
              const resAux = await axios.get(
                "http://localhost:3000/api/auxiliares",
              );

              setAuxiliares(resAux.data.data);
              toastr.clear(); // 🔥 limpia el toast
              toastr.success("Foto actualizada");
            } catch (error) {
              toastr.clear();
              toastr.error("Error al subir");
            }
          });

          cancelBtn?.addEventListener("click", () => {
            toastr.clear(); // 🔥 cierra el toast
            toastr.warning("Cancelado");
          });
        },
      },
    );
  };
  const guardarEquipo = async (data: EquipmentForm) => {
    try {
      const payload = {
        ...data,
        tipo: data.tipo === "OTRO" ? tipoManual : data.tipo,
      };

      await axios.post("http://localhost:3000/api/equipos", payload);

      toastr.success("Equipo creado");

      resetEquipment();

      setTipoManual("");

      setShowEquipmentModal(false);
    } catch (error) {
      toastr.error("Error al crear equipo");
    }
  };
  const descargarPDF = (inc: any) => {
    const doc = new jsPDF();

    // TITULO
    doc.setFontSize(18);
    doc.text("Reporte de Incidencia", 14, 20);

    // INFO
    doc.setFontSize(12);

    const datos = [
      ["Equipo", inc.equipo?.codigo_equipo],
      ["Laboratorio", inc.equipo?.laboratorio?.nombre],
      ["Auxiliar", inc.auxiliar?.nombre_completo],
      ["Turno", inc.turno],
      ["Tipo", inc.tipo],
      ["Descripción", inc.descripcion],
      [
        "Fecha",
        new Date(inc.fecha).toLocaleDateString("es-BO", {
          timeZone: "America/La_Paz",
        }),
      ],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Detalle"]],
      body: datos,
    });

    // DESCARGA
    doc.save(`incidencia_${inc.id_incidencia}.pdf`);
  };
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/logout",
        {},
        {
          withCredentials: true,
        },
      );

      localStorage.clear();
      sessionStorage.clear();

      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
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
              className="flex items-center cursor-pointer justify-between w-full px-3 py-2 rounded-lg bg-blue-100 text-black font-medium cursor-pointer"
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
                  className="text-left text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 cursor-pointer"
                >
                  Usuarios (Admin / Aux)
                </button>
                <button className="text-left text-sm px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                  Asistencias
                </button>
                <button className="text-left text-sm px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
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
              <button
                onClick={() => setView("incidencias")}
                className={`flex items-center gap-2 w-full px-3 py-2 cursor-pointer rounded-lg transition ${
                  view === "incidencias"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <ShoppingCart size={18} />
                Incidencias
              </button>
              <button
                onClick={() => setView("revisiones")}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer transition ${
                  view === "revisiones"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Calendar size={18} />
                Revisiones por turno
              </button>
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
              <button
                onClick={() => toggleMenu("equipos")}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Table size={18} />
                  Equipos
                </div>

                <ChevronDown
                  size={16}
                  className={`transition ${
                    openMenu === "equipos" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openMenu === "equipos" && (
                <div className="ml-8 mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => setShowEquipmentModal(true)}
                    className="text-left text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 cursor-pointer"
                  >
                    Agregar equipo nuevo
                  </button>

                  <button
                    onClick={() => setView("equipos")}
                    className="text-left text-sm px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    Mostrar equipos
                  </button>
                </div>
              )}
              <button
                onClick={() => toggleMenu("laboratorios")}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers size={18} />
                  Laboratorios
                </div>

                <ChevronDown
                  size={16}
                  className={`transition ${
                    openMenu === "laboratorios" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openMenu === "laboratorios" && (
                <div className="ml-8 mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      // aquí luego conectas tu modal o función
                      toastr.info("Agregar laboratorio");
                    }}
                    className="text-left text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 cursor-pointer"
                  >
                    Agregar laboratorio
                  </button>
                  <button
                    onClick={() => setView("laboratorios")}
                    className="text-left text-sm px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    Mostrar laboratorios
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-6 mb-2 px-2">CHAT</p>
            <button
              onClick={() => setOpenChat(true)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <MessageCircle size={18} />
              Chat Interno
            </button>
            <MenuItem
              icon={<Headphones size={18} />}
              text="Soporte técnico"
              badge
            />
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
              className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
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
            <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Moon size={20} />
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-100 relative cursor-pointer">
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
                    src={
                      adminData?.foto
                        ? `http://localhost:3000/uploads/${adminData.foto}?t=${Date.now()}`
                        : "https://i.pravatar.cc/100"
                    }
                    alt="admin"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                {/* INFO */}
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-gray-800">
                    {adminData?.nombre_completo}
                  </p>

                  <p className="text-xs text-gray-500">
                    {adminData?.rol?.nombre}
                  </p>
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
                      {adminData?.nombre_completo}
                    </p>

                    <p className="text-xs text-gray-500">
                      {adminData?.codigo_acceso}
                    </p>
                  </div>

                  {/* OPCIONES */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        obtenerPerfilAdmin();
                        setOpenUserMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm cursor-pointer"
                    >
                      <User size={16} /> Perfil
                    </button>

                    <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm cursor-pointer">
                      <Settings size={16} /> Configuración
                    </button>
                  </div>
                </div>
              )}
              {showProfileModal && adminData && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-[400px] rounded-2xl shadow-lg p-6 relative">
                    {/* CERRAR */}
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                    >
                      ✖
                    </button>

                    {/* FOTO */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <img
                          src={
                            preview
                              ? preview
                              : adminData?.foto
                                ? `http://localhost:3000/uploads/${adminData.foto}`
                                : "https://i.pravatar.cc/150"
                          }
                          className="w-full h-full rounded-full object-cover"
                        />

                        <label className="absolute bottom-0 right-0 z-10 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
                          ✏️
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                          />
                        </label>
                      </div>

                      <h2 className="text-lg font-bold">
                        {adminData.nombre_completo}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {adminData?.rol?.nombre}
                      </p>
                    </div>

                    {/* INFO */}
                    <div className="mt-5 space-y-2 text-sm">
                      <p>
                        <strong>ID:</strong> {adminData.id_usuario}
                      </p>
                      <p>
                        <strong>Código:</strong> {adminData.codigo_acceso}
                      </p>
                      <p>
                        <strong>Estado:</strong> {adminData.estado}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {new Date(
                          adminData.fecha_creacion,
                        ).toLocaleDateString()}
                      </p>
                      <button
                        onClick={cerrarSesion}
                        className="w-full mt-5 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl cursor-pointer transition"
                      >
                        Cerrar sesión
                      </button>
                    </div>
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
              {/* HERO */}
              <div className="bg-white rounded-3xl shadow-xl relative overflow-visible">
                <div className="grid grid-cols-2 items-center min-h-[380px]">
                  {/* IMAGEN */}
                  <div className="relative flex justify-center items-center">
                    {/* EFECTO FONDO */}
                    <div className="absolute w-[420px] h-[420px] bg-blue-100 rounded-full blur-3xl opacity-40"></div>

                    {/* IMAGEN */}
                    <img
                      src={logo}
                      alt="dashboard"
                      className="
    relative
    w-[135%]
    max-w-[650px]
    object-contain
    drop-shadow-2xl
    transition
    duration-500
    mt-6
    -ml-8
  "
                    />
                  </div>

                  {/* TEXTO */}
                  <div className="px-8">
                    <h1 className="text-4xl font-bold text-gray-800 leading-tight">
                      Sistema Inteligente de <br />
                      Control de Laboratorios
                    </h1>

                    <p className="text-gray-500 mt-4 text-lg leading-relaxed">
                      Administra incidencias, supervisa equipos operativos y
                      controla el trabajo de auxiliares en tiempo real desde un
                      solo panel.
                    </p>

                    <div className="mt-6 flex gap-3">
                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        Monitoreo en tiempo real
                      </div>

                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        Gestión inteligente
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARDS */}
              <div className="grid grid-cols-3 gap-6">
                {/* AUXILIARES */}
                <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Auxiliares activos
                      </p>

                      <h2 className="text-4xl font-bold text-gray-800 mt-3">
                        {auxiliaresActivos}
                      </h2>
                    </div>

                    <div className="bg-blue-100 p-3 rounded-xl">
                      <User className="text-blue-600" size={28} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${(auxiliaresActivos / auxiliares.length) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Auxiliares trabajando actualmente
                    </p>
                  </div>
                </div>

                {/* EQUIPOS */}
                <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Equipos operativos
                      </p>

                      <h2 className="text-4xl font-bold text-gray-800 mt-3">
                        {equipos.filter((e) => e.estado === "OPERATIVO").length}
                      </h2>
                    </div>

                    <div className="bg-green-100 p-3 rounded-xl">
                      <Monitor className="text-green-600" size={28} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-green-600 rounded-full"></div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Equipos funcionando correctamente
                    </p>
                  </div>
                </div>

                {/* INCIDENCIAS */}
                <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Incidencias registradas
                      </p>

                      <h2 className="text-4xl font-bold text-gray-800 mt-3">
                        {incidencias.length}
                      </h2>
                    </div>

                    <div className="bg-red-100 p-3 rounded-xl">
                      <ShieldCheck className="text-red-600" size={28} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-red-600 rounded-full"></div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Reportes detectados en el sistema
                    </p>
                  </div>
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
                              src={
                                aux.foto
                                  ? `http://localhost:3000/uploads/${aux.foto}`
                                  : "https://i.pravatar.cc/150"
                              }
                              className="w-10 h-10 rounded-full object-cover"
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
                                try {
                                  const nuevoEstado =
                                    aux.estado === "ACTIVO"
                                      ? "DESACTIVADO"
                                      : "ACTIVO";

                                  await axios.patch(
                                    `http://localhost:3000/api/auxiliares/${aux.id_usuario}`,
                                    {
                                      estado: nuevoEstado,
                                    },
                                  );

                                  const res = await axios.get(
                                    "http://localhost:3000/api/auxiliares",
                                  );

                                  setAuxiliares(res.data.data);

                                  toastr.success("Estado actualizado");
                                } catch (error) {
                                  console.log(error);
                                  toastr.error("Error al actualizar");
                                }
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                                aux.estado === "ACTIVO"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {aux.estado === "ACTIVO" ? "ACTIVO" : "INACTIVO"}
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
          {view === "equipos" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gestión de Equipos</h2>

                <button
                  onClick={() => setView("dashboard")}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  ← Volver
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-3">Código</th>

                      <th>Laboratorio</th>

                      <th>Tipo</th>

                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {equipos.map((equipo) => (
                      <tr
                        key={equipo.id_equipo}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 font-medium">
                          {equipo.codigo_equipo}
                        </td>

                        <td>{equipo.id_laboratorio}</td>

                        <td>{equipo.tipo}</td>

                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              equipo.estado === "OPERATIVO"
                                ? "bg-green-100 text-green-700"
                                : equipo.estado === "MANTENIMIENTO"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {equipo.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {view === "incidencias" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Gestión de Incidencias
                </h2>

                <button
                  onClick={() => setView("dashboard")}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  ← Volver
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b text-gray-500">
                      <th className="py-3">Equipo</th>
                      <th>Laboratorio</th>
                      <th>Auxiliar</th>
                      <th>Turno</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>Descargar</th>
                    </tr>
                  </thead>

                  <tbody>
                    {incidencias.map((inc) => (
                      <tr
                        key={inc.id_incidencia}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3">{inc.equipo?.codigo_equipo}</td>

                        <td>{inc.equipo?.laboratorio?.nombre}</td>

                        <td>{inc.auxiliar?.nombre_completo}</td>

                        <td>{inc.turno}</td>

                        <td>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              inc.tipo === "HARDWARE"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {inc.tipo}
                          </span>
                        </td>

                        <td>{inc.descripcion}</td>

                        <td>{new Date(inc.fecha).toLocaleDateString()}</td>

                        <td>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600"></span>

                            <button
                              onClick={() => descargarPDF(inc)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                            >
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {view === "revisiones" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Revisiones por Turno</h2>

                <button
                  onClick={() => setView("dashboard")}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  ← Volver
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* TURNO DIA */}
                <div className="border rounded-xl p-4">
                  <h3 className="font-bold text-blue-600 mb-4">Turno Día</h3>

                  <div className="space-y-3">
                    {incidencias.filter(
                      (i) => i.turno?.toUpperCase() === "MAÑANA",
                    ).length > 0 ? (
                      incidencias
                        .filter((i) => i.turno?.toUpperCase() === "MAÑANA")
                        .map((inc) => (
                          <div
                            key={inc.id_incidencia}
                            className="bg-gray-50 border rounded-lg p-3 space-y-1"
                          >
                            <p className="text-sm">
                              <span className="font-semibold">Fecha:</span>{" "}
                              {new Date(inc.fecha).toLocaleDateString()}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">Auxiliar:</span>{" "}
                              {inc.auxiliar?.nombre_completo}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">
                                Laboratorio:
                              </span>{" "}
                              {inc.equipo?.laboratorio?.nombre}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">Equipo:</span>{" "}
                              {inc.equipo?.codigo_equipo}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No se reportó ninguna incidencia
                      </p>
                    )}
                  </div>
                </div>

                {/* TURNO TARDE */}
                <div className="border rounded-xl p-4">
                  <h3 className="font-bold text-orange-600 mb-4">
                    Turno Tarde
                  </h3>

                  <div className="space-y-3">
                    {incidencias.filter(
                      (i) => i.turno?.toUpperCase() === "TARDE",
                    ).length > 0 ? (
                      incidencias
                        .filter((i) => i.turno?.toUpperCase() === "TARDE")
                        .map((inc) => (
                          <div
                            key={inc.id_incidencia}
                            className="bg-gray-50 border rounded-lg p-3 space-y-1"
                          >
                            <p className="text-sm">
                              <span className="font-semibold">Fecha:</span>{" "}
                              {new Date(inc.fecha).toLocaleDateString()}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">Auxiliar:</span>{" "}
                              {inc.auxiliar?.nombre_completo}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">
                                Laboratorio:
                              </span>{" "}
                              {inc.equipo?.laboratorio?.nombre}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">Equipo:</span>{" "}
                              {inc.equipo?.codigo_equipo}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No se reportó ninguna incidencia
                      </p>
                    )}
                  </div>
                </div>

                {/* TURNO NOCHE */}
                <div className="border rounded-xl p-4">
                  <h3 className="font-bold text-purple-600 mb-4">
                    Turno Noche
                  </h3>

                  <div className="space-y-3">
                    {incidencias.filter(
                      (i) => i.turno?.toUpperCase() === "NOCHE",
                    ).length > 0 ? (
                      incidencias
                        .filter((i) => i.turno?.toUpperCase() === "NOCHE")
                        .map((inc) => (
                          <div
                            key={inc.id_incidencia}
                            className="bg-gray-50 border rounded-lg p-3 space-y-1"
                          >
                            <p className="text-sm">
                              <span className="font-semibold">Fecha:</span>{" "}
                              {new Date(inc.fecha).toLocaleDateString()}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">Auxiliar:</span>{" "}
                              {inc.auxiliar?.nombre_completo}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">
                                Laboratorio:
                              </span>{" "}
                              {inc.equipo?.laboratorio?.nombre}
                            </p>

                            <p className="text-sm">
                              <span className="font-semibold">Equipo:</span>{" "}
                              {inc.equipo?.codigo_equipo}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No se reportó ninguna incidencia
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {openChat && (
            <div className="fixed right-0 top-0 h-full w-[350px] bg-white shadow-2xl border-l flex flex-col z-50">
              {/* HEADER */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold">Chat Interno (Admin)</h2>

                <button
                  onClick={() => setOpenChat(false)}
                  className="text-red-500 cursor-pointer"
                >
                  ✖
                </button>
              </div>

              {/* MENSAJES */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
                {mensajes.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center mt-10">
                    No hay mensajes
                  </p>
                ) : (
                  mensajes.map((msg, i) => (
                    <div
                      key={i}
                      className="bg-white p-2 rounded shadow text-sm"
                    >
                      {msg}
                    </div>
                  ))
                )}
              </div>

              {/* INPUT */}
              <div className="p-3 border-t flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />

                <button
                  onClick={() => {
                    if (!input.trim()) return;
                    setMensajes([...mensajes, input]);
                    setInput("");
                  }}
                  className="bg-blue-600 text-white px-3 rounded cursor-pointer"
                >
                  Enviar
                </button>
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
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer"
              >
                ✖
              </button>
            </div>

            {/* TABS */}
            <div className="flex gap-4 mb-6 border-b pb-2">
              <button
                onClick={() => setTab("admin")}
                className={`px-3 py-1 rounded ${
                  tab === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 cursor-pointer"
                }`}
              >
                Administrador
              </button>

              <button
                onClick={() => setTab("aux")}
                className={`px-3 py-1 rounded ${
                  tab === "aux"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 cursor-pointer"
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

                <button className="col-span-2 bg-blue-600 text-white py-2 rounded cursor-pointer">
                  Crear Auxiliar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {showEquipmentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Registrar Equipo</h2>

              <button
                onClick={() => setShowEquipmentModal(false)}
                className="text-red-500 text-xl cursor-pointer"
              >
                ✖
              </button>
            </div>

            <form
              onSubmit={handleSubmitEquipment(guardarEquipo)}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Código equipo"
                className="w-full border p-3 rounded-xl"
                {...registerEquipment("codigo_equipo")}
              />

              {errorsEquipment.codigo_equipo && (
                <p className="text-red-500 text-sm">
                  {errorsEquipment.codigo_equipo.message}
                </p>
              )}

              <select
                className="w-full border p-3 rounded-xl"
                {...registerEquipment("id_laboratorio")}
              >
                <option value="">Seleccionar laboratorio</option>

                {laboratorios.map((lab) => (
                  <option key={lab.id_laboratorio} value={lab.id_laboratorio}>
                    {lab.nombre}
                  </option>
                ))}
              </select>

              {errorsEquipment.id_laboratorio && (
                <p className="text-red-500 text-sm">
                  {errorsEquipment.id_laboratorio.message}
                </p>
              )}

              <select
                className="w-full border p-3 rounded-xl"
                {...registerEquipment("tipo")}
              >
                <option value="">Tipo</option>

                <option value="CPU">CPU</option>

                <option value="LAPTOP">LAPTOP</option>

                <option value="OTRO">OTRO</option>
              </select>
              {watchEquipmentTipo === "OTRO" && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escriba el tipo manualmente"
                    value={tipoManual}
                    onChange={(e) => setTipoManual(e.target.value)}
                    className="w-full border p-3 pr-10 rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setTipoManual("");
                      resetEquipment({
                        codigo_equipo: "",
                        id_laboratorio: "",
                        tipo: "",
                        estado: "",
                      });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 font-bold cursor-pointer"
                  >
                    ✖
                  </button>
                </div>
              )}
              <select
                className="w-full border p-3 rounded-xl"
                {...registerEquipment("estado")}
              >
                <option value="">Estado</option>

                <option value="OPERATIVO">OPERATIVO</option>

                <option value="MANTENIMIENTO">MANTENIMIENTO</option>

                <option value="DAÑADO">DAÑADO</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-xl cursor-pointer"
              >
                Guardar equipo
              </button>
            </form>
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
        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded cursor-pointer">
          NUEVO
        </span>
      )}
    </button>
  );
}
