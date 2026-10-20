import type { ReactDebugInfo } from "./ReactTypes";

export type ReactElement = {
  $$typeof: any;
  type: any;
  key: any;
  ref: any;
  props: any;
  _owner: any;

  // __DEV__
  _store: { validated: 0 | 1 | 2 };
  _debugInfo: ReactDebugInfo | null;
  _debugStack: Error;
  _debugTask: any;
};
