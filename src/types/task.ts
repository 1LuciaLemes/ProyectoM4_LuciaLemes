// Definición de qué es una tarea
import { Timestamp } from "firebase/firestore";

export interface TasksProps {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Timestamp;
}

export interface TodoFormProps {
    title: string;
    description?: string;
}

export interface TodoFormSubmitProps {
    onSubmit: (title: string, description?: string) => void;
    onCancel?: () => void;
    initialData?: {
        title: string;
        description?: string;
    };
    mode?: "create" | "edit";
}

export interface TodoListProps {
    tasks: TasksProps[];
    ToggleTask: (id: string) => void;
    DeleteTask: (id: string) => void;
    EditTask: (task: TasksProps) => void;
}

export interface TodoItemProps {
    task: TasksProps;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: TasksProps) => void;
}