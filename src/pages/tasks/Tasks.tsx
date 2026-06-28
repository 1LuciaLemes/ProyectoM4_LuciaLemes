// Pantalla principal de tareas conecta la logica del hook
// con la visual (UI) de components

import TodoList from "../../components/TodoList"
import useTasks from "../../hooks/useTasks"
import TodoForm from "../../components/TodoForm";
import { useState } from "react";
import type { TasksProps } from "../../types/task";
import { useAuth } from "../../features/auth/Authenticator";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";

function Tasks(): JSX.Element {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout(): Promise<void> {
        await logout();
        navigate("/login");
    }

    const initialLetter = user?.email?.charAt(0).toUpperCase() || "U"

    const { tasks, addTask, editTask, deleteTask, toggleTaskStatus } = useTasks(user?.uid);

    // estado para mostrar el formulario solo si: Quiero agregar tarea / Quiero editar tarea
    const [showForm, setShowForm] = useState(false);

    // guardo la tarea que se está editando (si existe)
    const [taskToEdit, setTaskToEdit] = useState<TasksProps | null>(null);

    // abre el formulario en modo "crear tarea"
    function handleBtnAddTask() {
        setTaskToEdit(null);
        setShowForm(true);
    }

    // handler para que reconozca si lo que quiero hacer es editar o crear tarea
    // si hay una tarea a editar, la actualiza, sino creo una nueva
    function handleSubmit(title: string, description: string) {
        if (taskToEdit) {
            editTask({
                ...taskToEdit,
                title,
                description
            });
        } else {
            addTask(title, user!.uid, description);
        }
        setShowForm(false);
    }

    // setea la tarea a editar y muestra el formulario en modo edición
    function handleEdit(task: TasksProps) {
        setTaskToEdit(task);
        setShowForm(true);
    }

    return (
        <div className="task-page">
            <div>
                {initialLetter}
            </div>
            <button
                className="btn-add-task"
                onClick={handleBtnAddTask}>
                Agregar nueva tarea
            </button>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <TodoForm
                            onSubmit={handleSubmit}
                            mode={taskToEdit ? "edit" : "create"}
                            initialData={taskToEdit || undefined}
                            onCancel={() => {
                                setShowForm(false);
                                setTaskToEdit(null);
                            }}
                        />
                    </div>
                </div>
            )}
            <TodoList
                tasks={tasks}
                ToggleTask={toggleTaskStatus}
                DeleteTask={deleteTask}
                EditTask={handleEdit}
            />
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}

export default Tasks