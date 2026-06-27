import { useState } from "react";
import { useAuth } from "../../features/auth/Authenticator";
import { useNavigate } from "react-router-dom";
import type { JSX, FormEvent } from "react";
import "./LoginPage.css";

function LoginPage(): JSX.Element {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate("/tasks");
        } catch (err) {
            setError("Error al iniciar sesión.");  // lo mejoramos en el Bloque 7
        }
    }

    async function handleGoogle(): Promise<void> {
        await signInWithGoogle();
        navigate("/tasks");
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h2>Iniciar sesión</h2>

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Ingresar</button>

                <button
                    type="button"
                    onClick={handleGoogle}
                    className="google-btn"
                >
                    Iniciar con Google
                </button>

                {error && <p role="alert" aria-live="assertive">{error}</p>}
            </form>
        </div>
    );
}
export default LoginPage;

