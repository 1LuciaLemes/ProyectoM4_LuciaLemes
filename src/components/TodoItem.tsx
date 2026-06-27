// Tarea como un solo item
import type { TodoItemProps } from "../types/task";

function TodoItem({ task, onToggle, onDelete, onEdit }: TodoItemProps) {
    return (
        <div className="task-item">
            <div className="task-header">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                />

                <span
                    className="task-title"
                    style={{
                        textDecoration: task.completed ? "line-through" : "none"
                    }}
                >
                    {task.title}
                </span>
            </div>

            {task.description && (
                <div className="task-description">
                    <p>{task.description}</p>
                </div>
            )}

            <div className="task-item-actions">
                <button onClick={() => onEdit(task)}>
                    Editar
                </button>

                <button onClick={() => onDelete(task.id)}>
                    Eliminar
                </button>
            </div>
        </div>
    )
}

export default TodoItem