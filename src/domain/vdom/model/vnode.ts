export interface VNode {
  type: string | Function
  props: Record<string, any> | null
  children: any[]
}
