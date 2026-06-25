import TodoItem from "./TodoItem"
import type { TodoListProps } from "../types/task";

// Lista de las tareas creadas en form, pero mostradas en TodoItem
// 1. Tengo que mapear el array de tareas guardado
// 2. Acceder a cada tarea y mostrarla
function TodoList({
    tasks,
    ToggleTask,
    DeleteTask,
    EditTask
}: TodoListProps) {
    return (
        <div>
            {tasks.map(task => (
                <TodoItem
                    key={task.id}
                    task={task}
                    onToggle={ToggleTask}
                    onDelete={DeleteTask}
                    onEdit={EditTask}
                />
            ))}
        </div>
    );
}

export default TodoList