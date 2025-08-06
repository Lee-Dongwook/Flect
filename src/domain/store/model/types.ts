// Core Redux Types
export interface Action<T = any> {
  type: T
  payload?: any
  meta?: any
  error?: boolean
}

export interface AnyAction extends Action {
  [extraProps: string]: any
}

export interface Reducer<S = any, A extends Action = AnyAction> {
  (state: S | undefined, action: A): S
}

export interface Store<S = any, A extends Action = AnyAction> {
  dispatch: Dispatch<A>
  getState(): S
  subscribe(listener: () => void): () => void
  replaceReducer(nextReducer: Reducer<S, A>): void
}

export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T
  <R>(asyncAction: ThunkAction<R, any, any, A>): R
}

// Redux Toolkit Specific Types
export interface SliceOptions<
  State = any,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
> {
  name: string
  initialState: State
  reducers: ValidateSliceCaseReducers<State, CaseReducers>
  extraReducers?: CaseReducers extends SliceCaseReducers<State>
    ? ValidateSliceCaseReducers<State, CaseReducers>
    : Partial<CaseReducers>
}

export interface SliceCaseReducers<State> {
  [K: string]: (state: State, action: AnyAction) => State | void
}

export type ValidateSliceCaseReducers<State, CR extends SliceCaseReducers<State>> = {
  [K in keyof CR]: CR[K] extends (state: State, action: AnyAction) => State | void ? CR[K] : never
}

export interface Slice<
  State = any,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
> {
  name: string
  reducer: Reducer<State>
  actions: SliceActions<CaseReducers>
  caseReducers: SliceCaseReducers<State>
  getInitialState(): State
}

export type SliceActions<CaseReducers> = {
  [K in keyof CaseReducers]: CaseReducers[K] extends (state: any, action: infer A) => any
    ? A extends { payload: infer P }
      ? (payload: P) => A
      : () => A
    : never
}

// Async Thunk Types
export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: Dispatch<A>,
  getState: () => S,
  extraArgument: E
) => R

export interface AsyncThunkOptions<ThunkArg = void> {
  serializeError?: (x: unknown) => any
  idGenerator?: () => string
  condition?: (arg: ThunkArg, { getState }: { getState: () => any }) => boolean | undefined
  dispatchConditionRejection?: boolean
}

export interface AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig> {
  pending: ActionCreator<PendingAction>
  fulfilled: ActionCreator<FulfilledAction<Returned, ThunkArg>>
  rejected: ActionCreator<RejectedAction<ThunkArg>>
  settled: ActionCreator<FulfilledAction<Returned, ThunkArg> | RejectedAction<ThunkArg>>
}

export interface PendingAction {
  type: string
  meta: {
    requestId: string
    arg: any
  }
}

export interface FulfilledAction<Returned, ThunkArg> {
  type: string
  payload: Returned
  meta: {
    requestId: string
    arg: ThunkArg
  }
}

export interface RejectedAction<ThunkArg> {
  type: string
  error: any
  meta: {
    requestId: string
    arg: ThunkArg
    aborted: boolean
    condition: boolean
  }
}

// Middleware Types
export interface Middleware<DispatchExt = {}, S = any, D extends Dispatch = Dispatch> {
  (api: MiddlewareAPI<D, S>): (next: D) => D & DispatchExt
}

export interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D
  getState(): S
}

// Store Configuration Types
export interface ConfigureStoreOptions<
  S = any,
  A extends Action = AnyAction,
  M extends Middleware[] = Middleware[],
> {
  reducer: Reducer<S, A> | ReducersMapObject<S, A>
  preloadedState?: DeepPartial<S>
  middleware?: M | ((getDefaultMiddleware: GetDefaultMiddleware<S>) => M)
  devTools?: boolean | DevToolsOptions
  enhancers?: StoreEnhancer[] | ConfigureEnhancersCallback
}

export type ReducersMapObject<S = any, A extends Action = AnyAction> = {
  [K in keyof S]: Reducer<S[K], A>
}

export type GetDefaultMiddleware<S = any> = <M extends Middleware[] = Middleware[]>(
  options?: GetDefaultMiddlewareOptions
) => M

export interface GetDefaultMiddlewareOptions {
  thunk?: boolean | ThunkOptions
  serializableCheck?: boolean | SerializableCheckOptions
  immutableCheck?: boolean | ImmutableCheckOptions
}

export interface ThunkOptions {
  extraArgument?: any
}

export interface SerializableCheckOptions {
  ignoredActions?: string[]
  ignoredActionPaths?: string[]
  ignoredPaths?: string[]
  warnAfter?: number
  ignoreState?: boolean
  ignoreActions?: boolean
}

export interface ImmutableCheckOptions {
  ignoredPaths?: string[]
  warnAfter?: number
}

export interface DevToolsOptions {
  name?: string
  actionCreators?: ActionCreator[]
  latency?: number
  maxAge?: number
  serialize?: boolean | SerializeOptions
  actionSanitizer?: (action: AnyAction, id: number) => AnyAction
  stateSanitizer?: (state: any, index: number) => any
  actionsBlacklist?: string | string[]
  actionsWhitelist?: string | string[]
  predicate?: (state: any, action: AnyAction) => boolean
  shouldRecordChanges?: boolean
  pauseActionType?: string
  autoPause?: boolean
  shouldStartLocked?: boolean
  shouldHotReload?: boolean
  shouldCatchErrors?: boolean
  features?: any
}

export interface SerializeOptions {
  options?: boolean | any
  replacer?: (key: string, value: any) => any
  reviver?: (key: string, value: any) => any
}

export type StoreEnhancer<Ext = {}, StateExt = {}> = (
  next: StoreEnhancerStoreCreator<Ext, StateExt>
) => StoreEnhancerStoreCreator<Ext, StateExt>

export type StoreEnhancerStoreCreator<Ext = {}, StateExt = {}> = <
  S = any,
  A extends Action = AnyAction,
>(
  reducer: Reducer<S, A>,
  preloadedState?: S
) => Store<S & StateExt, A> & Ext

export type ConfigureEnhancersCallback = (defaultEnhancers: StoreEnhancer[]) => StoreEnhancer[]

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type ActionCreator<P = any> = P extends void
  ? () => Action<string>
  : (payload: P) => Action<string> & { payload: P }
