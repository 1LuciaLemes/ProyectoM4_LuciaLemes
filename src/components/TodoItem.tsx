// Tarea como un solo item
import { useState } from "react";
import type { TodoItemProps } from "../types/task";

function TodoItem({ task, onToggle, onDelete, onEdit }: TodoItemProps) {
    //Tengo que manejar los estados para editar, titulo y descripción
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(task.title)
    const [editDescription, setEditDescription] = useState(task.description || "")

    // función handler auxiliar que identifica si tengo un título para editar (que no sea)
    // vacío, define los parámetros que necesita onEdit para trabajar que vienen de sus
    // respectivos estados, sino fuese así no sabría qué tiene que editar
    const handleEdit = () => {
        if (!editTitle.trim()) return;
        onEdit(task.id, editTitle, editDescription);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="Task-editing">
                {/* Input donde coloco el nuevo título */}
                <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                />
                {/* Input donde edito la descripción */}
                <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                />
                <button onClick={handleEdit}>Guardar</button>
                <button onClick={() =>
                    setIsEditing(false)}>Cancelar</button>
            </div>
        );
    }

    return (
        <div className="Task">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
            />
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.title}
            </span>
            {task.description && <p>{task.description}</p>}
            <button onClick={() => setIsEditing(true)}>Editar</button>
            <button onClick={() => onDelete(task.id)}>Eliminar</button>
        </div>
    )
}

export default TodoItem