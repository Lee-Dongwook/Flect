export function View({ children, style }: any) {
  return {
    type: 'View',
    props: { style, children },
  }
}
