import { useState } from '../../domain/hooks/services/useState'
import { useEffect } from '../../domain/hooks/services/useEffect'
import {
  configureStore,
  createSlice,
  createAsyncThunk,
  useStore,
  useDispatch,
  useSelector,
  StoreContext,
} from '../../domain/store'

// Counter slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, loading: false },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Async thunk
const fetchUserById = createAsyncThunk('users/fetchById', async (userId: number) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  return response.json()
})

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.loading = false
      })
  },
})

// Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    user: userSlice.reducer,
  },
})

// Counter component
function Counter() {
  const dispatch = useDispatch()
  const counter = useSelector((state: any) => state.counter)

  return (
    <div>
      <h2>Counter: {counter.value}</h2>
      <button onClick={() => dispatch(counterSlice.actions.increment())}>Increment</button>
      <button onClick={() => dispatch(counterSlice.actions.decrement())}>Decrement</button>
      <button onClick={() => dispatch(counterSlice.actions.incrementByAmount(5))}>Add 5</button>
    </div>
  )
}

// User component
function User() {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)

  return (
    <div>
      <h2>User</h2>
      {user.loading && <p>Loading...</p>}
      {user.user && (
        <div>
          <h3>{user.user.name}</h3>
          <p>Email: {user.user.email}</p>
        </div>
      )}
      <button onClick={() => dispatch(fetchUserById(1))}>Fetch User</button>
    </div>
  )
}

// Main component
export function ReduxExample() {
  return (
    <StoreContext.Provider value={store}>
      <div>
        <h1>Redux Toolkit Example</h1>
        <Counter />
        <User />
      </div>
    </StoreContext.Provider>
  )
}
