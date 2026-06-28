import { getDocs, query, where, orderBy, collection } from "firebase/firestore"
import type { TasksProps } from "../types/task";
import { db } from "./firebase";

// fetch para obtener tareas
async function getTasksByUser(uId: string): Promise<TasksProps[]> {
    const q = query(
        collection(db, "tasks"),
        where("userId", "==", uId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TasksProps, "id">),
    }));
}

export default getTasksByUser