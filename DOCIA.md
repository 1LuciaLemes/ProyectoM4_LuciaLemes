# Documentación del uso de Inteligencia Artificial

Durante el desarrollo del proyecto se utilizó Inteligencia Artificial como herramienta de apoyo para validar lógica, comprender conceptos de React, revisar componentes y mejorar la arquitectura del código.

Las respuestas obtenidas fueron utilizadas como guía para analizar problemas, aplicar mejoras y tomar decisiones de implementación.
La Inteligencia Artificial no fue utilizada para generar el proyecto completo, sino como herramienta de consulta durante el desarrollo. Las sugerencias fueron analizadas, adaptadas y aplicadas según las necesidades de la aplicación.

---

# Ayuda 1 - Validación de la función `toggleTask`

## Prompt

> Revisá mi función `toggleTask`. Actualmente permite marcar una tarea como completada, pero no volver a dejarla como pendiente. ¿La lógica es correcta o debería cambiarla?

## Respuesta utilizada

La implementación inicial solamente permitía cambiar una tarea desde `complete: false` hacia `complete: true`, por lo que una tarea completada no podía volver a su estado anterior.

Código inicial:

```ts
const toggleTask = (id: string) => {
    setTasks(oldTasks =>
        oldTasks.map(task =>
            task.id == id && task.complete == false
                ? { ...task, complete: true }
                : task
        )
    )
}
```

La lógica fue modificada para invertir el valor actual de `complete`:

```ts
const toggleTask = (id: string) => {
    setTasks(oldTasks =>
        oldTasks.map(task =>
            task.id === id
                ? { ...task, complete: !task.complete }
                : task
        )
    )
}
```

También se aplicó el uso de `===` en lugar de `==` para realizar una comparación estricta y evitar conversiones automáticas de tipos.

---

# Ayuda 2 - Comprensión del componente `TodoItem`

## Prompt

> Sin modificar mi código, explicame cómo debería trabajar el componente `TodoItem` y cuál es la forma recomendada de estructurarlo en React.

## Respuesta utilizada

El componente `TodoItem` debería funcionar como un componente de presentación.

Su responsabilidad es mostrar la información de una tarea y ejecutar acciones recibidas desde un componente padre mediante props.

Una estructura recomendada es:

```tsx
interface TodoItemProps {
    task: TasksProps;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}
```

El componente recibe la tarea y las funciones necesarias:

```tsx
function TodoItem({
    task,
    onToggle,
    onDelete
}: TodoItemProps) {

    return (
        <div className="Task">

            <input
                type="checkbox"
                checked={task.complete}
                onChange={() => onToggle(task.id)}
            />

            <span>
                {task.title}
            </span>

            <button onClick={() => onDelete(task.id)}>
                Eliminar
            </button>

        </div>
    );
}
```

Esto permite separar responsabilidades:

- `TodoItem` muestra información.
- El componente padre controla la lógica y el estado.

---

# Ayuda 3 - Revisión del componente `TodoForm`

## Prompt

> ¿Mi componente `TodoForm` está correctamente implementado? Todavía no estoy teniendo en cuenta Firebase ni autenticación. También explicame qué función cumple el elemento `<span>` dentro de `TodoItem`.

## Respuesta utilizada

El formulario tenía una estructura correcta para manejar inputs mediante estado local, pero necesitaba controlar el envío de información.

La lógica del formulario debe manejar el evento `submit`:

```tsx
function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!form.title.trim()) return;

    onSubmit(
        form.title,
        form.description
    );

    setForm({
        title: "",
        description: ""
    });
}
```

El formulario debe utilizar esta función:

```tsx
<form onSubmit={handleSubmit}>
```

y debe tener un botón de envío:

```tsx
<button type="submit">
    Agregar tarea
</button>
```

El elemento `<span>` dentro de `TodoItem` funciona como un contenedor de texto. Permite mostrar información de la tarea y aplicar estilos dinámicos.

Ejemplo:

```tsx
<span
    style={{
        textDecoration: task.complete
            ? "line-through"
            : "none"
    }}
>
    {task.title}
</span>
```

Esto permite mostrar visualmente si una tarea está completada.

---

# Ayuda 4 - Reutilización del formulario para edición

## Prompt

> Quiero reutilizar el mismo formulario para crear y editar tareas. Necesito que durante la edición cambie el texto del botón y pueda cancelar la edición. ¿Cuál sería una buena forma de hacerlo?

## Respuesta utilizada

El formulario puede reutilizarse agregando propiedades que indiquen el modo actual.

Se puede definir:

```ts
type TodoFormSubmitProps = {

    onSubmit: (
        title: string,
        description: string
    ) => void;

    initialData?: {
        title: string;
        description?: string;
    };

    mode?: "create" | "edit";

};
```

El botón cambia según el modo:

```tsx
<button type="submit">

    {
        mode === "edit"
            ? "Guardar cambios"
            : "Agregar tarea"
    }

</button>
```

Para cancelar la edición:

```tsx
{
    mode === "edit" && (

        <button
            type="button"
            onClick={onCancel}
        >
            Cancelar
        </button>

    )
}
```

Esto evita tener dos formularios diferentes y permite reutilizar el mismo componente.

---

# Ayuda 5 - Formulario dentro de un modal

## Prompt

> Quiero mostrar el formulario como un modal. ¿Cómo puedo abrirlo, cerrarlo y evitar que se cierre cuando hago click dentro del formulario?

## Respuesta utilizada

El modal puede controlarse con un estado booleano:

```tsx
{
    showForm && (

        <div
            className="modal-overlay"
            onClick={() => setShowForm(false)}
        >

            <div
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <TodoForm
                    onSubmit={handleSubmit}
                    mode="create"
                    onCancel={() =>
                        setShowForm(false)
                    }
                />

            </div>

        </div>

    )
}
```

El contenedor externo funciona como fondo del modal.

Al hacer click fuera:

```
click en overlay
        ↓
setShowForm(false)
        ↓
se cierra el modal
```

El `stopPropagation()` evita que el evento se propague:

```
click dentro del formulario
        ↓
div interno
        ↓
no llega al overlay
        ↓
el modal continúa abierto
```

Esto permite interactuar con inputs y botones sin cerrar la ventana.

---

# Ayuda 6 - Refactorización de componentes

## Prompt

> Revisá la estructura de mis componentes. Quiero reutilizar el formulario para crear y editar tareas, evitar código duplicado y mejorar la separación de responsabilidades.

## Respuesta utilizada

La estructura anterior tenía lógica de edición dentro de `TodoItem`, lo que generaba duplicación del formulario.

La solución fue separar responsabilidades:

Antes:

```
TodoItem

- muestra tarea
- contiene inputs de edición
- controla botones
- maneja estado de edición
```

Después:

```
Tasks

- controla estado
- abre modal
- crea tareas
- edita tareas


TodoForm

- maneja inputs
- crea o modifica tareas


TodoItem

- muestra información
- ejecuta acciones
```

También se modificó la edición para trabajar con el objeto completo:

Antes:

```ts
EditTask(id, title, description)
```

Después:

```ts
EditTask(task: TasksProps)
```

Esto facilita la escalabilidad y evita pasar múltiples parámetros.

Además, al cancelar una edición se limpia el estado:

```tsx
onCancel={() => {

    setShowForm(false);

    setTaskToEdit(null);

}}
```

Esto evita que información de una edición anterior quede cargada al volver a abrir el formulario.

---

# Ayuda 7 - Integración de tareas con Firestore

## Prompt

> Necesito manejar el estado de las tareas para poder mostrar todas las tareas del usuario en pantalla utilizando Firestore. ¿Cómo debería manejar la carga de datos desde Firebase dentro de React?

## Respuesta utilizada

Al trabajar con Firestore, la carga de datos debe manejarse desde el hook encargado de las tareas.

El flujo consiste en:

- Esperar a que exista un usuario autenticado.
- Obtener las tareas desde Firestore.
- Guardar la información obtenida en el estado local mediante `setTasks`.

Como `useEffect` no puede declararse como una función `async`, se utiliza una función interna:

```tsx
useEffect(() => {

    if (!userId) return;

    async function loadTasks() {

        const data = await getTasksByUser(userId);

        setTasks(data);

    }

    loadTasks();

}, [userId]);
```

De esta forma, cada vez que cambia el usuario autenticado se vuelven a cargar sus tareas.

La responsabilidad queda separada:

- Firebase se encarga de obtener los datos.
- El hook administra el estado.
- Los componentes muestran la información.

---

# Ayuda 8 - Implementación del estado `loading`

## Prompt

> Quiero mostrar un estado visual de carga mientras se obtienen las tareas desde Firebase. ¿Dónde debería manejar el loading y cuál sería la forma correcta de implementarlo?

## Respuesta utilizada

El estado de carga debe manejarse dentro del hook `useTasks`, ya que pertenece a la lógica de obtención de información y no al componente visual.

Se agrega un estado:

```tsx
const [loading, setLoading] = useState(false);
```

La carga debe activarse antes de realizar la consulta y finalizar cuando la operación termine:

```tsx
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
```

No se debe realizar:

```tsx
setLoading(true);

loadTasks();

setLoading(false);
```

porque `loadTasks` es asíncrona y el estado de carga se desactivaría antes de que Firebase termine la consulta.

El hook debe devolver también el estado:

```tsx
return {

    tasks,

    loading,

    addTask,

    editTask,

    toggleTaskStatus,

    deleteTask

};
```

Luego el componente puede acceder al estado:

```tsx
const {
    tasks,
    loading
} = useTasks(user?.uid);
```

Y renderizar según corresponda:

```tsx
{
    loading ? (

        <p>Cargando tareas...</p>

    ) : (

        <TodoList
            tasks={tasks}
            ToggleTask={toggleTaskStatus}
            DeleteTask={deleteTask}
            EditTask={handleEdit}
        />

    )
}
```

Esto evita mostrar una interfaz vacía mientras los datos todavía están siendo cargados.

---

# Ayuda 9 - Personalización del scrollbar

## Prompt

> Quiero mejorar visualmente el scroll de la lista de tareas. ¿Cómo puedo personalizar el scrollbar para que tenga un estilo más limpio?

## Respuesta utilizada

La apariencia del scrollbar puede modificarse utilizando CSS.

Primero se reserva espacio para evitar movimientos visuales:

```css
scrollbar-gutter: stable;
```

Luego se personaliza el ancho:

```css
.tasks-list::-webkit-scrollbar {

    width: 6px;

}
```

Se modifica el fondo:

```css
.tasks-list::-webkit-scrollbar-track {

    background: transparent;

}
```

Y se cambia la barra del scroll:

```css
.tasks-list::-webkit-scrollbar-thumb {

    background: rgba(120, 120, 120, 0.25);

    border-radius: 20px;

    transition: background 0.2s ease;

}
```

También se puede agregar un estilo cuando el usuario pasa el mouse:

```css
.tasks-list::-webkit-scrollbar-thumb:hover {

    background: rgba(120, 120, 120, 0.45);

}
```

Esto permite mejorar la interfaz visual sin modificar la lógica del componente.

---

# Ayuda 10 - Testing de hooks con Firebase

## Prompt

> Estoy trabajando con React, TypeScript, Firebase y Vitest. Tengo un hook que maneja lógica CRUD (por ejemplo `useTasks` con agregar, editar, eliminar y cambiar estado). Quiero entender cómo testear este tipo de lógica cuando hay Firebase involucrado. ¿Qué cosas se deben mockear y cómo se separa la lógica del hook de la infraestructura externa?

## Respuesta utilizada

Cuando se trabaja con Firebase u otros servicios externos, el objetivo del test no es comprobar que Firebase funciona correctamente, sino comprobar cómo responde la lógica del hook frente a diferentes respuestas simuladas.

La idea principal es aislar la lógica del hook de la infraestructura externa:

- Firebase se reemplaza mediante mocks.
- Los servicios propios también pueden simularse.
- El test controla qué datos entran y verifica qué estado queda como resultado.

El patrón utilizado es:

```
ARRANGE
Preparar datos iniciales y mocks.

ACT
Ejecutar la acción que se quiere probar.

ASSERT
Verificar el estado final.
```

En este caso, el test del hook `useTasks` simula la obtención inicial de tareas, la creación de una nueva tarea y luego verifica que el estado final del hook se actualizó correctamente.

Ejemplo utilizado:

```tsx
/**
 * MOCK DEL SERVICE (capa intermedia)
 *
 * Este mock reemplaza la función real que obtiene datos.
 * En lugar de comunicarse con Firebase, se controla
 * manualmente qué información devuelve.
 *
 * El objetivo no es probar Firebase, sino probar
 * cómo el hook reacciona a esos datos.
 */
vi.mock("../services/tasks", () => ({
    default: vi.fn(),
}));

const mockedGetTasksByUser = vi.mocked(getTasksByUser);


/**
 * MOCK DE FIREBASE
 *
 * Firebase es una dependencia externa, por lo que
 * se reemplaza para evitar:
 *
 * - llamadas reales a la base de datos
 * - dependencia de internet
 * - resultados variables en los tests
 *
 * Solo se simulan las funciones utilizadas por el hook.
 */
vi.mock("firebase/firestore", () => ({
    getFirestore: vi.fn(),
    addDoc: vi.fn().mockResolvedValue({
        id: "2"
    }),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    collection: vi.fn(),
    serverTimestamp: vi.fn(),
}));


describe("useTasks - addTask", () => {

    it("cuando agrego una tarea, la lista se actualiza", async () => {


        /**
         * ARRANGE
         *
         * Estado inicial del sistema.
         *
         * Simula lo que devolvería Firebase
         * antes de realizar una acción.
         */
        mockedGetTasksByUser
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea mock 1",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as unknown as any,
                },
            ])


            /**
             * ARRANGE
             *
             * Estado esperado luego de la acción.
             *
             * Cuando addTask termina, el hook vuelve
             * a consultar los datos.
             */
            .mockResolvedValueOnce([
                {
                    id: "1",
                    title: "Tarea mock 1",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as unknown as any,
                },
                {
                    id: "2",
                    title: "Tarea mock 2",
                    description: "",
                    completed: false,
                    createdAt: "mock-date" as unknown as any,
                },
            ]);


        /**
         * ACT
         *
         * Renderiza el hook como si estuviera
         * siendo utilizado dentro de un componente React.
         */
        const { result } = renderHook(() => useTasks("user-1"));


        /**
         * Espera la carga inicial del useEffect.
         */
        await act(async () => {});


        /**
         * ACT
         *
         * Simula la acción del usuario:
         * crear una nueva tarea.
         */
        await act(async () => {

            await result.current.addTask(
                "Nueva tarea",
                "user-1"
            );

        });


        /**
         * ASSERT
         *
         * Se verifica el estado final del hook.
         *
         * No se comprueba Firebase,
         * se comprueba el resultado de la lógica.
         */
        expect(result.current.tasks)
            .toHaveLength(2);


        expect(result.current.tasks[1])
            .toEqual({
                id: "2",
                title: "Tarea mock 2",
                description: "",
                completed: false,
                createdAt: "mock-date" as unknown as any,
            });

    });

});
```

Este ejemplo sigue el patrón utilizado en el proyecto:

- mock de servicios externos;
- simulación de respuestas;
- ejecución de acciones del hook;
- validación del estado final.

El mismo enfoque puede aplicarse para todo el CRUD:

- `addTask` → verificar que aparece una nueva tarea.
- `deleteTask` → verificar que la tarea desaparece.
- `editTask` → verificar que los datos cambian.
- `toggleTaskStatus` → verificar el cambio de estado booleano.

La idea principal es:

> El hook es lo que se prueba. Firebase solamente es una dependencia simulada.