// Definición de qué es una tarea

export interface TasksProps {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
}

export interface TodoFormProps {
    title: string;
    description?: string;
}

export interface TodoFormSubmitProps {
    onSubmit: (title: string, description?: string) => void;
}


export interface TodoItemProps {
    task: TasksProps;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (
        id: string,
        title: string,
        description?: string
    ) => void;
}