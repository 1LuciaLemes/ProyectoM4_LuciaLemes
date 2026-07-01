import { useState } from "react";
import { useAuth } from "../../features/auth/Authenticator";
import { useNavigate } from "react-router-dom";
import type { JSX, FormEvent } from "react";
import "./LoginPage.css";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../utils/utils";

function LoginPage(): JSX.Element {
    const { theme, toggleTheme } = useTheme();
    const { signIn, signInWithGoogle, signUp } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate("/tasks");
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-credential":
                case "auth/wrong-password":
                case "auth/user-not-found":
                    setError("Correo o contraseña incorrectos.");
                    return;

                default:
                    setError("No fue posible iniciar sesión.");
                    return
            }
        }
    }

    async function handleRegister(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {
            await signUp(email, password, name);
            navigate("/tasks");
        } catch (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    setError("Ya existe un usuario con ese correo.");
                    return
                case "auth/weak-password":
                    setError("La contraseña debe contener al menos 6 carácteres");
                    return
                default: "Ocurrió un error inesperado.";
                    return
            }
        }
    }

    async function handleGoogle(): Promise<void> {
        await signInWithGoogle();
        navigate("/tasks");
    }

    return (
        <div className="main-container">
            <section className="login-header">
                <h1>
                    Menos desorden.
                    <br />
                    Más productividad.</h1>
                <p>
                    Gestioná tus tareas diarias, mantené el control de tu trabajo y
                    accedé a tu información desde cualquier dispositivo.
                </p>
                <ul className="login-list">
                    <li>
                        ✓ Gestión de tareas
                    </li>
                    <li>
                        ✓ Sincronización en la nube
                    </li>
                    <li>
                        ✓ Notificaciones por email
                    </li>
                </ul>
            </section>
            <section className="login-container">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="theme-btn"
                >
                    {theme === "dark" ? (
                        <>
                            <Sun size={18} />
                            <span className="theme-text">Modo claro</span>
                        </>
                    ) : (
                        <>
                            <Moon size={18} />
                            <span className="theme-text">Modo oscuro</span>
                        </>
                    )}
                </button>
                <form onSubmit={isRegister ? handleRegister : handleLogin}>
                    <h2>{isRegister ? "Crear cuenta" : "Iniciar sesión"} </h2>
                    <p className="login-subtitle">
                        Accedé para gestionar tus tareas.
                    </p>

                    {isRegister && (
                        <div>
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Lucía Lemes"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required={isRegister}
                            />
                        </div>
                    )
                    }

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="lucialem@email.com"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            setError("")
                        }}
                        required
                    />

                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Ingresá tu contraseña"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                            setError("")
                        }}
                        required
                    />

                    {error && (
                        <p className="login-error" role="alert" aria-live="assertive">
                            {error}
                        </p>
                    )}
                    <br />

                    <button type="submit">
                        {isRegister ? "Registrarse" : "Ingresar"}
                    </button>


                    <button
                        type="button"
                        onClick={handleGoogle}
                        className="google-btn"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="google-icon"
                        />
                        Continuar con Google
                    </button>

                    <div className="auth-footer">
                        <span>{isRegister ? "" : "¿No tenés una cuenta?"}</span>
                        <button
                            type="button"
                            className="link-btn"
                            onClick={() => { setIsRegister(!isRegister); setError("") }}
                        >
                            {isRegister ? "Iniciar sesión" : "Registrate"}
                        </button>
                    </div>
                </form>
            </section>
        </div >
    );
}
export default LoginPage;

