import React, { useState } from "react";
import type { TodoFormProps, TodoFormSubmitProps } from "../types/task";

// formulario de crear tarea, solo lo visual
function TodoForm({ onSubmit }: TodoFormSubmitProps) {
    const [form, setForm] = useState<TodoFormProps>({
        title: "",
        description: ""
    });

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
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.title.trim()) return;
        onSubmit(form.title, form.description || ""); //cuando se envía se guardan estos datos
        setForm({ title: "", description: "" }); //se resetea el formulario
    }

    return (
        <form onSubmit={handleSubmit}>
            <label >
                Titulo
                <input name="title" value={form.title} onChange={handleChange} />
            </label>
            <label>
                Descripción
                <input name="description" value={form.description} onChange={handleChange} />
            </label>
            <button type="submit"> Agregar Tarea</button>
            {/* Faltan las validaciones y los estados (cargando, success, error) */}
        </form>
    )
}

export default TodoForm