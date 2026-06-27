// este archivo procesa datos recibidos
import { useState } from "react";
import type { TasksProps } from "../types/task";

function useTasks() {
    // estado de las tareas
    const [tasks, setTasks] = useState<TasksProps[]>([]);

    // funcion para añadir tarea
    const AddTask = (title: string, description?: string) => {
        const newTask = {
            id: crypto.randomUUID(),
            title,
            description,
            completed: false
        }
        setTasks(oldTasks => [...oldTasks, newTask])
    }

    // funcion para editar tarea
    const EditTask = (task: TasksProps) => {
        setTasks(oldTasks =>
            oldTasks.map(t =>
                t.id === task.id ? { ...t, ...task } : t
            )
        );
    };

    // funcion para eliminar tarea
    const DeleteTask = (id: string) => {
        setTasks(oldTasks =>
            oldTasks.filter(task => task.id !== id)
        )
    }

    // funcion para tarea completada o no
    const ToggleTask = (id: string) => {
        setTasks(oldTasks =>
            oldTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        )
    }

    return {
        tasks,
        AddTask,
        EditTask,
        DeleteTask,
        ToggleTask
    }
}

export default useTasks