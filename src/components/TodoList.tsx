import { useState } from 'react'
import { generateUUID } from '../util/id-generator'

export type Todo = {
    id: string
    content: string
    completed: boolean
};

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
    const { content, completed } = todo
    return (
        <div className='todo-item'>
            <input type='checkbox' checked={completed} />
            <span>{content}</span>
        </div>
    )
}

export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState<string>('')

    const handleAddTodo = () => {
        if (!newTodo) {
            return
        }
        const todo: Todo = {
            id: generateUUID(),
            content: newTodo,
            completed: false,
        }
        setTodos([...todos, todo])
        setNewTodo('')
    }

    return (
        <div className='todo-list'>
            <div className='todo-list-header'>
                <input
                    type='text'
                    placeholder='Add todo'
                    value={newTodo}
                    onChange={(event) => setNewTodo(event.target.value)}
                />
                <button onClick={handleAddTodo}>Add</button>
            </div>
            <div className='todo-list-body'>
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </div>
        </div>
    )
}
