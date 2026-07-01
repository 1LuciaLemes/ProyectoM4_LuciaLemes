// este archivo procesa datos recibidos
import { useState, useEffect } from "react";
import type { TasksProps } from "../types/task";
import { collection, serverTimestamp, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import getTasksByUser from "../services/tasks";


function useTasks(userId?: string) {
    const [tasks, setTasks] = useState<TasksProps[]>([]);
    const [loading, setLoading] = useState(false);

    // cargar las tareas cuando cambio de usuario
    // uso useEffect porque traerlas de firestone es un efecto secundario (sE)
    useEffect(() => {
        if (!userId) return;

        async function loadTasks() {
            setLoading(true);

            try {
                const data = await getTasksByUser(userId);
                setTasks(data);
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, [userId]);

    // Añadir tarea
    async function addTask(title: string, userId: string, description?: string) {
        const docRef = await addDoc(collection(db, "tasks"), {
            userId,
            title,
            description,
            completed: false,
            createdAt: serverTimestamp()
        });

        const data = await getTasksByUser(userId);
        setTasks(data);
        return docRef.id;
    }

    // editar titulo y/o descripcion
    async function editTask(task: TasksProps) {
        // referencia al documento usando doc()
        const taskRef = doc(db, "tasks", task.id);

        // campo que quiero cambiar
        await updateDoc(taskRef, {
            title: task.title,
            description: task.description
        });

        if (!userId) return;

        const data = await getTasksByUser(userId);
        setTasks(data);
    }

    // eliminar tarea
    async function deleteTask(taskId: string) {
        const taskRef = doc(db, "tasks", taskId);

        await deleteDoc(taskRef);

        if (!userId) return;

        const data = await getTasksByUser(userId);
        setTasks(data);
    }


    // tarea completada o no
    async function toggleTaskStatus(taskId: string) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        await updateDoc(doc(db, "tasks", taskId), {
            completed: !task.completed
        });

        if (!userId) return;

        const data = await getTasksByUser(userId);
        setTasks(data);
    }

    return {
        tasks,
        loading,
        addTask,
        editTask,
        toggleTaskStatus,
        deleteTask
    }
}

export default useTasks