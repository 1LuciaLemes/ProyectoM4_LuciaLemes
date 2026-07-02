import { useState } from "react";
import type { TasksProps } from "../types/task";

type EmailSummaryButtonProps = {
    todos: TasksProps[];
    userEmail: string;
};

function EmailSummaryButton({
    todos,
    userEmail,
}: EmailSummaryButtonProps) {

    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");

    const [errorMsg, setErrorMsg] = useState("");

    async function handleSend(): Promise<void> {
        setStatus("loading");
        setErrorMsg("");

        const summary = buildTodoSummary(todos);

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: userEmail,
                    summary,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus("error");
                setErrorMsg(
                    data?.message ?? "Ocurrió un error al enviar el correo."
                );
                return;
            }

            setStatus("success");
        } catch {
            setStatus("error");
            setErrorMsg("No se pudo conectar con el servidor.");
        }
    }

    return (
        <div>
            <button
                className="btn-email-summary"
                onClick={handleSend}
                disabled={status === "loading"}
            >
                {status === "loading"
                    ? "Enviando..."
                    : "Enviar resumen"}
            </button>

            {status === "success" && (
                <p className="text-email-succes">
                    ¡Resumen enviado correctamente!
                </p>
            )}

            {status === "error" && (
                <p className="text-email-error">
                    {errorMsg}
                </p>
            )}
        </div>
    );
}

function buildTodoSummary(todos: TasksProps[]): string {
    const pendientes = todos.filter((t) => !t.completed).length;
    const completadas = todos.filter((t) => t.completed).length;

    return `
Resumen de tus tareas

Pendientes: ${pendientes}
Completadas: ${completadas}
`;
}

export default EmailSummaryButton;