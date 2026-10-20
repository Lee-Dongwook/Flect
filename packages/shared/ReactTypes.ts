import type { ReactOptimisticKey } from "./ReactSymbols";

export type { ReactOptimisticKey };

export type ReactKey = null | string | ReactOptimisticKey;

export type ReactNode =
  | React.ReactElement<any>
  | ReactPortal
  | ReactText
  | ReactFragment
  | ReactProvider<any>
  | ReactConsumer<any>;

export type ReactEmpty = null | undefined | boolean;
export type ReactFragment = ReactEmpty | Iterable<React.ReactNode>;
export type ReactNodeList = ReactEmpty | React.ReactNode;
export type ReactText = string | number;

export type ReactProvider<T> = {
  $$typeof: symbol | number;
  type: ReactContext<T>;
  key: ReactKey;
  ref: null;
  props: {
    value: T;
    children?: ReactNodeList;
  };
};

export type ReactConsumerType<T> = {
  $$typeof: symbol | number;
  _context: ReactContext<T>;
};

export type ReactConsumer<T> = {
  $$typeof: symbol | number;
  type: ReactConsumerType<T>;
  key: ReactKey;
  ref: null;
  props: {
    children: (value: T) => ReactNodeList;
  };
};

export type ReactContext<T> = {
  $$typeof: symbol | number;
  Consumer: ReactConsumerType<T>;
  Provider: ReactContext<T>;
  _currentValue: T;
  _currentValue2: T;
  _threadCount: number;
  //DEV
  _currentRenderer? object | null;
  _currentRenderer2 ?: object | null;
  displayName?: string;
};

export type ReactPortal = {
    $$typeof: symbol | number;
    key: ReactKey;
    containerInfo: any;
    children: ReactNodeList;
    implementation: any;
};

export type RefObject = {
  current: any;
};

export type ReactScope = {
  $$typeof: symbol | number;
};

export type ReactScopeQuery = (
  type: string,
  props: Record<string, unknown>, 
  instance: unknown,
) => boolean;

export type ReactScopeInstance = {
  DO_NOT_USE_queryAllNodes(query: ReactScopeQuery): null | Array<object>;
  DO_NOT_USE_queryFirstNode(query: ReactScopeQuery): null | object;
  containsNode(node: object): boolean;
  getChildContextValues<T>(context: ReactContext<T>): Array<T>;
};

export interface Wakeable {
  then(onFulfill: () => unknown, onReject: () => unknown): void | Wakeable;
}

interface ThenableImpl<T> {
  then(
    onFulfill: (value: T) => unknown,
    onReject: (error: unknown) => unknown,
  ): void | Wakeable;
  displayName?: string;
}

interface UntrackedThenable<T> extends ThenableImpl<T> {
  status?: undefined;
  _debugInfo?: null | ReactDebugInfo;
}

export interface PendingThenable<T> extends ThenableImpl<T> {
  status: 'pending';
  _debugInfo?: null | ReactDebugInfo;
}

export interface WeakPendingThenable<T> extends ThenableImpl<T> {
  status: 'pending_weak';
  _debugInfo?: null | ReactDebugInfo;
}

export interface FulfilledThenable<T> extends ThenableImpl<T> {
  status: 'fulfilled';
  value: T;
  _debugInfo?: null | ReactDebugInfo;
}

export interface RejectedThenable<T> extends ThenableImpl<T> {
  status: 'rejected';
  reason: unknown;
  _debugInfo?: null | ReactDebugInfo;
}

export type Thenable<T> =
  | UntrackedThenable<T>
  | PendingThenable<T>
  | WeakPendingThenable<T>
  | FulfilledThenable<T>
    | RejectedThenable<T>;
  
export type ReactRecoverableReason = string | (() => unknown);

export type ReactRecoverable = {
  $$typeof: symbol;
  _reason: ReactRecoverableReason | undefined;
};

export type StartTransitionOptions = {
  name?: string;
};

export type Usable<T> = Thenable<T> | ReactContext<T> | ReactRecoverable;

export type ReactCustomFormAction = {
  name?: string;
  action?: string;
  encType?: string;
  method?: string;
  target?: string;
  data?: null | FormData;
};

export type ReactFormState<S, ReferenceId> = [
    S,
    string,
    ReferenceId,
    number,
]

export type GestureProvider = any;

export type GestureOptions = {
  rangeStart?: number;
  rangeEnd?: number;
};

export type Awaited<T> = T extends null | undefined
  ? T
  : T extends object
    ? T extends { then(onfulfilled: infer F): any }
      ? F extends (value: infer V) => any
        ? Awaited<V>
        : never 
      : T
    : T;

export type ReactCallSite = [
    string,
    string,
    number,
    number,
    number,
    number,
    boolean,
]

export type ReactStackTrace = Array<ReactCallSite>;

export type ReactFuntionLocation = [
    string,
    string,
    number,
    number,
]

export type ReactComponentInfo = {
    readonly name: string;
    readonly env?: string;
    readonly key?: ReactKey;
    readonly owner?: null | ReactComponentInfo;
    readonly stack?: null | ReactStackTrace;
    readonly props?: null | Record<string, unknown>;
    readonly debugStack?: null | Error;
    readonly debugTask?: null | any;
    debugLocation?: null | Error;
}

export type ReactEnvironmentInfo = {
  readonly env: string;
};

export type ReactErrorInfoProd = {
  readonly digest: string;
};

export type JSONValue =
  | string
  | boolean
  | number
  | null
  | { readonly [key: string]: JSONValue }
  | ReadonlyArray<JSONValue>;

export type ReactErrorInfoDev = {
  readonly digest?: string;
  readonly name: string;
  readonly message: string;
  readonly stack: ReactStackTrace;
  readonly env: string;
  readonly owner?: null | string;
  cause?: JSONValue;
  errors?: JSONValue;
};

export type ReactErrorInfo = ReactErrorInfoProd | ReactErrorInfoDev;

export type ReactIOInfo = {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly byteSize?: number;
  readonly value?: null | Promise<unknown>;
  readonly env?: string;
  readonly owner?: null | ReactComponentInfo;
  readonly stack?: null | ReactStackTrace;
  readonly debugStack?: null | Error;
  readonly debugTask?: null | any;
};

export type ReactAsyncInfo = {
  readonly awaited: ReactIOInfo;
  readonly env?: string;
  readonly owner?: null | ReactComponentInfo;
  readonly stack?: null | ReactStackTrace;
  readonly debugStack?: null | Error;
  readonly debugTask?: null | any;
};

export type ReactTimeInfo = {
  readonly time: number;
};

export type ReactDebugInfoEntry =
  | ReactComponentInfo
  | ReactEnvironmentInfo
  | ReactAsyncInfo
  | ReactTimeInfo;

export type ReactDebugInfo = Array<ReactDebugInfoEntry>;

export type ViewTransitionInstance = any;

export type ViewTransitionClassPerType = {
  [transitionType: string]: 'none' | 'auto' | string; 
};

export type ViewTransitionClass =
  | 'none'
  | 'auto'
  | string
  | ViewTransitionClassPerType;

export type GestureOptionsRequired = {
  rangeStart: number;
  rangeEnd: number;
};

export type ViewTransitionProps = {
  name?: string;
  children?: ReactNodeList;
  default?: ViewTransitionClass;
  enter?: ViewTransitionClass;
  exit?: ViewTransitionClass;
  share?: ViewTransitionClass;
  update?: ViewTransitionClass;
  parentEnter?: ViewTransitionClass;
  parentExit?: ViewTransitionClass;
  onEnter?: (
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onExit?: (
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onParentEnter?: (
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onParentExit?: (
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onShare?: (
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onUpdate?: (
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onGestureEnter?: (
    timeline: GestureProvider,
    options: GestureOptionsRequired,
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onGestureExit?: (
    timeline: GestureProvider,
    options: GestureOptionsRequired,
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onGestureParentEnter?: (
    timeline: GestureProvider,
    options: GestureOptionsRequired,
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onGestureParentExit?: (
    timeline: GestureProvider,
    options: GestureOptionsRequired,
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onGestureShare?: (
    timeline: GestureProvider,
    options: GestureOptionsRequired,
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
  onGestureUpdate?: (
    timeline: GestureProvider,
    options: GestureOptionsRequired,
    instance: ViewTransitionInstance,
    types: Array<string>,
  ) => void | (() => void);
};

export type ActivityProps = {
  mode?: 'hidden' | 'visible' | null | undefined;
  children?: ReactNodeList;
  name?: string;
};

export type SuspenseProps = {
  children?: ReactNodeList;
  fallback?: ReactNodeList;
  suspenseCallback?: (value: Set<Wakeable> | null) => unknown;
  unstable_avoidThisFallback?: boolean;
  defer?: boolean;
  name?: string;
};

export type SuspenseListRevealOrder =
  | 'forwards'
  | 'backwards'
  | 'unstable_legacy-backwards'
  | 'together'
  | 'independent'
  | undefined;

export type SuspenseListTailMode = 'visible' | 'collapsed' | 'hidden' | undefined;

type SuspenseListRow = Exclude<
  ReactNodeList,
  Iterable<React.ReactNode> | AsyncIterable<React.ReactNode>
>;

type DirectionalSuspenseListProps = {
  children?: Iterable<SuspenseListRow> | AsyncIterable<SuspenseListRow>;
  revealOrder: 'forwards' | 'backwards' | 'unstable_legacy-backwards';
  tail?: SuspenseListTailMode;
};

type NonDirectionalSuspenseListProps = {
  children?: ReactNodeList;
  revealOrder?: 'independent' | 'together' | undefined;
  tail?: undefined;
};

export type SuspenseListProps =
  | DirectionalSuspenseListProps
  | NonDirectionalSuspenseListProps;

export type TracingMarkerProps = {
  name: string;
  children?: ReactNodeList;
};

export type CacheProps = {
  children?: ReactNodeList;
};

export type ProfilerPhase = 'mount' | 'update' | 'nested-update';

export type ProfilerProps = {
  id?: string;
  onRender?: (
    id: undefined | string,
    phase: ProfilerPhase,
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
  ) => void;
  onCommit?: (
    id: undefined | string,
    phase: ProfilerPhase,
    effectDuration: number,
    commitTime: number,
  ) => void;
  children?: ReactNodeList;
};
