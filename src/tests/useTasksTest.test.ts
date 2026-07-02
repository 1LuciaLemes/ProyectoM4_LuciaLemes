import { describe, it, vi, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTasks from "../hooks/useTasks";
import getTasksByUser from "../services/tasks";

/**
 * 🔵 MOCK DEL SERVICE (capa intermedia)
 * 
 * Este mock reemplaza la función real que trae datos.
 * En vez de ir a Firebase, nosotros controlamos qué devuelve.
 * 
 * IMPORTANTE:
 * - No probamos Firebase
 * - Probamos cómo el hook reacciona a estos datos simulados
 */
vi.mock("../services/tasks", () => ({
    default: vi.fn(),
}));

const mockedGetTasksByUser = vi.mocked(getTasksByUser);

/**
 * 🔵 MOCK DE FIREBASE
 * 
 * Firebase es una dependencia externa.
 * Se mockea para evitar:
 * - llamadas reales a base de datos
 * - costos
 * - flakiness en tests
 * 
 * Solo simulamos las funciones que el hook usa.
 */
vi.mock("firebase/firestore", () => ({
    getFirestore: vi.fn(),
    addDoc: vi.fn().mockResolvedValue({ id: "2" }), // simula creación exitosa
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    collection: vi.fn(),
    serverTimestamp: vi.fn(),
}));

describe("useTasks - addTask", () => {

    it("cuando agrego una tarea, la lista se actualiza", async () => {

        /**
         * 🟡 ARRANGE (estado inicial del sistema)
         * 
         * Simulamos lo que el backend devuelve ANTES de hacer cualquier acción.
         * En este caso: el usuario tiene 1 tarea.
         */
        mockedGetTasksByUser
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea mock 1",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as unknown as any,
                },
            ])

            /**
             * 🟡 ARRANGE (estado después de la acción)
             * 
             * Cuando se ejecuta addTask, el hook vuelve a pedir datos (refetch).
             * Simulamos la respuesta actualizada con la nueva tarea incluida.
             */
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea mock 1",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as unknown as any,
                },
                {
                    id: "2",
                    title: "Tarea mock 2",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as unknown as any,
                },
            ]);

        /**
         * 🟡 RENDER DEL HOOK
         * 
         * Simula cómo React ejecutaría el hook en un componente real.
         * Esto permite testear su estado interno.
         */
        const { result } = renderHook(() => useTasks("user-1"));

        /**
         * 🟡 ESPERAMOS EFECTO INICIAL
         * 
         * useEffect dentro del hook carga las tareas iniciales.
         * Necesitamos esperar a que termine antes de testear.
         */
        await act(async () => { });

        /**
         * 🟡 ACT (acción del usuario)
         * 
         * Simulamos el comportamiento real:
         * el usuario crea una nueva tarea.
         */
        await act(async () => {
            await result.current.addTask("Nueva tarea", "user-1");
        });

        /**
         * 🟢 ASSERT (verificación final)
         * 
         * Verificamos el estado del hook, no Firebase.
         * Si el hook funciona bien, ahora debe tener 2 tareas.
         */
        expect(result.current.tasks).toHaveLength(2);

        /**
         * Verificamos que la nueva tarea esté en el estado final.
         */
        expect(result.current.tasks[1]).toEqual({
            id: "2",
            title: "Tarea mock 2",
            description: "",
            completed: false,
            createdAt: "mock-date" as unknown as any,
        });
    });
});

// Test para la funcion editar tarea
describe("useTasks - editTask", () => {
    it("cuando edito una tarea, la lista se actualiza", async () => {

        mockedGetTasksByUser
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea 1",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as any,
                },
            ])
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea 1 editada",
                    description: "Nueva descripción",
                    completed: false,
                    createdAt: "mock-date" as any,
                },
            ]);

        const { result } = renderHook(() => useTasks("user-1"));

        await act(async () => { });

        await act(async () => {
            await result.current.editTask({
                id: "1",
                title: "Tarea 1 editada",
                description: "Nueva descripción",
                completed: false,
                createdAt: "mock-date" as any,
            });
        });

        expect(result.current.tasks[0].title).toBe("Tarea 1 editada");
        expect(result.current.tasks[0].description).toBe("Nueva descripción");
    });
});

// Test para la función borrar tarea
describe("useTasks - deleteTask", () => {
    it("cuando elimino una tarea, se borra de la lista", async () => {

        mockedGetTasksByUser
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea 1",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as any,
                },
                {
                    id: "2",
                    title: "Tarea 2",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as any,
                },
            ])
            .mockResolvedValueOnce([
                {
                    id: "2",
                    title: "Tarea 2",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as any,
                },
            ]);

        const { result } = renderHook(() => useTasks("user-1"));

        await act(async () => { });

        await act(async () => {
            await result.current.deleteTask("1");
        });

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].id).toBe("2");
    });
});

// Test para cuando la tarea está completada
describe("useTasks - toggleTaskStatus", () => {
    it("cuando cambio el estado de una tarea, se actualiza", async () => {

        mockedGetTasksByUser
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea 1",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as any,
                },
            ])
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea 1",
                    description: "",
                    completed: true,
                    createdAt: "mock-date" as any,
                },
            ]);

        const { result } = renderHook(() => useTasks("user-1"));

        await act(async () => { });

        await act(async () => {
            await result.current.toggleTaskStatus("1");
        });

        expect(result.current.tasks[0].completed).toBe(true);
    });
});