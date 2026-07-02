import { describe, it, expect, vi } from "vitest";
import getTasksByUser from "../services/tasks";

import {
    getDocs,
    collection,
    query,
    where,
    orderBy,
} from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
    getDocs: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
}));

vi.mock("../services/firebase", () => ({
    db: {},
}));

describe("getTasksByUser", () => {

    it("devuelve las tareas desde Firestone", async () => {

        (collection as any).mockReturnValue("tasks-collection");
        (where as any).mockReturnValue("where");
        (orderBy as any).mockReturnValue("orderBy");
        (query as any).mockReturnValue("query");

        (getDocs as any).mockResolvedValue({
            docs: [
                {
                    id: "1",
                    data: () => ({
                        title: "Tarea 1 de Firestone",
                        description: "",
                        completed: false,
                        createdAt: "mock-date",
                        userId: "user-1",
                    }),
                },
            ],
        });

        const result = await getTasksByUser("user-1");

        expect(result).toHaveLength(1);

        expect(result[0]).toEqual({
            id: "1",
            title: "Tarea 1 de Firestone",
            description: "",
            completed: false,
            createdAt: "mock-date",
            userId: "user-1",
        });
    });

});