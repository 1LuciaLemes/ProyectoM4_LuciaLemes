// Pantalla principal de tareas conecta la logica del hook
// con la visual (UI) de components

import TodoList from "../components/TodoList";
import useTasks from "../hooks/useTasks";

function Tasks() {
    const { tasks, ToggleTask, DeleteTask, EditTask } = useTasks();

    return (
        <TodoList
            tasks={tasks}
            ToggleTask={ToggleTask}
            DeleteTask={DeleteTask}
            EditTask={EditTask}
        />
    );
}

export default Tasks