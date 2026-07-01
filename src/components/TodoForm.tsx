import React, { useState, useEffect } from "react";
import type { TodoFormProps, TodoFormSubmitProps } from "../types/task";

// formulario de crear/editar tarea, solo lo visual
function TodoForm({ onSubmit, onCancel, initialData, mode = "create" }: TodoFormSubmitProps) {
    const [form, setForm] = useState<TodoFormProps>({
        title: initialData?.title || "",
        description: initialData?.description || ""
    });

    // valida si estoy editando o generando una nueva tarea
    // - si estoy editando carga los valores que tiene la tarea (la descripción es opcional)
    // - si tengo que crear una tarea no tengo valores
    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title,
                description: initialData.description || ""
            });
        } else {
            setForm({
                title: "",
                description: ""
            });
        }
    }, [initialData]);

    // handle para manejar que el contenido title y description puesto en el input
    // se guarden en el estado, el evento que se escucha es el del input
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // funcion para enviar el formulario y limpiar los input
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // evita enviar tareas sin titulo
        if (!form.title.trim()) return;

        //cuando se envía se guardan estos datos
        onSubmit(form.title, form.description || "");

        // se limpian los valores del formulario
        setForm({ title: "", description: "" });
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <label
                htmlFor="text">
                Titulo
            </label>
            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Titulo"
                maxLength={50}
            />

            <label
                htmlFor="text">
                Descripción
            </label>
            <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción"
                maxLength={120}
            />

            <div className="form-actions">
                <button
                    className="btn-form-save"
                    type="submit">
                    {mode === "edit" ? "Guardar Cambios" : "Agregar nueva tarea"}
                </button>
                <button
                    className="btn-form-cancel"
                    type="button"
                    onClick={onCancel}>
                    {mode === "edit" ? "Cancelar edición" : "Cancelar"}
                </button>
            </div>
            {/* TODO: agregar las validaciones y los estados (cargando, success, error) */}
        </form>
    )
}

export default TodoForm