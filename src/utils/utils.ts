// funcion auxiliar para cambiar de tema claro/oscuro
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;

        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

        setTheme(initialTheme);
        document.body.classList.toggle("dark", initialTheme === "dark");
    }, []);

    function toggleTheme() {
        setTheme(prev => {
            const newTheme = prev === "dark" ? "light" : "dark";

            document.body.classList.toggle("dark", newTheme === "dark");
            localStorage.setItem("theme", newTheme);

            return newTheme;
        });
    }

    return {
        theme,
        toggleTheme
    };
}