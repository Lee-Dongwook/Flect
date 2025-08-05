import { useState } from '../../domain/hooks/services/useState'

export function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div id="app">
      <h1>Count: {count}</h1>
      <button onclick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
