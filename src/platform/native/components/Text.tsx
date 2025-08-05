export function Text({ children, style }: any) {
  return {
    type: 'Text',
    props: {
      text: typeof children === 'string' ? children : '',
      ...style,
    },
  }
}
