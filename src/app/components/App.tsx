import { useState } from '../../domain/hooks/services/useState'

export function App() {
  const [count, setCount] = useState<number>(0)

  console.log('App rendering with count:', count)

  return (
    <div id="app">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
