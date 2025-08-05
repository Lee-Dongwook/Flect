export interface VNode {
  type: string | Function
  props: {
    [key: string]: any
    children?: Array<VNode | string | number | boolean | null>
  }
}
