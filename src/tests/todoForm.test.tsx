import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoForm from "../components/TodoForm";

describe("TodoForm", () => {
    it("envía los datos correctamente al hacer submit", () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(
            <TodoForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                mode="create"
            />
        );

        //  INPUTS CON DATOS MOCKEADOS
        // titulo
        fireEvent.change(screen.getByPlaceholderText("Titulo"), {
            target: { value: "Tarea 1" }
        });

        // descripción
        fireEvent.change(screen.getByPlaceholderText("Descripción"), {
            target: { value: "Descripción 1" }
        });

        // evento agregar nueva tarea
        fireEvent.click(
            screen.getByText("Agregar nueva tarea")
        );

        // verificar que fue llamado correctamente
        expect(onSubmit).toHaveBeenCalledTimes(1);

        expect(onSubmit).toHaveBeenCalledWith(
            "Tarea 1",
            "Descripción 1"
        );
    });

    it("no envía si el título está vacío", () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(
            <TodoForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                mode="create"
            />
        );

        fireEvent.change(screen.getByPlaceholderText("Titulo"), {
            target: { value: "" }
        });

        fireEvent.click(
            screen.getByText("Agregar nueva tarea")
        );

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("llama a onCancel cuando se presiona cancelar", () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(
            <TodoForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                mode="create"
            />
        );

        fireEvent.click(
            screen.getByText("Cancelar")
        );

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});