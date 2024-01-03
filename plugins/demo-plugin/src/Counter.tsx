import { useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>Count: {count}</p>
            hello
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
