// Tarea como un solo item
import type { TodoItemProps } from "../types/task";
import { X, Pen } from "lucide-react";

function TodoItem({ task, onToggle, onDelete, onEdit }: TodoItemProps) {

    return (
        <div className="task-item">
            <div className="task-header">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                    />
                </label>

                <span
                    className="task-title"
                    style={{
                        textDecoration: task.completed ? "line-through" : "none"
                    }}
                >
                    {task.title}
                </span>
                <div className="task-item-actions">
                    <button
                        className="icon-btn edit"
                        onClick={() => onEdit(task)}
                        aria-label="Editar tarea"
                    >
                        <Pen />
                    </button>

                    <button
                        className="icon-btn delete"
                        onClick={() => onDelete(task.id)}
                        aria-label="Eliminar tarea"
                    >
                        <X />
                    </button>
                </div>
            </div>

            {task.description && (
                <div className="task-description">
                    <p>{task.description}</p>
                </div>
            )}

        </div>
    )
}

export default TodoItem