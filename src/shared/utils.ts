type Compare<T> = (a: T, b: T) => number

export class MinHeap<T> {
  private heap: T[] = []
  private compare: Compare<T>

  constructor(compare: Compare<T>) {
    this.compare = compare
  }

  peek(): T | null {
    return this.heap.length === 0 ? null : this.heap[0]
  }

  push(item: T): void {
    this.heap.push(item)
    this.bubbleUp()
  }

  pop(): T | null {
    if (this.heap.length === 0) return null
    const top = this.heap[0]
    const end = this.heap.pop()
    if (this.heap.length > 0 && end) {
      this.heap[0] = end
      this.bubbleDown()
    }

    return top
  }

  size(): number {
    return this.heap.length
  }

  private bubbleUp(): void {
    let index = this.heap.length - 1
    const element = this.heap[index]

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      const parent = this.heap[parentIndex]

      if (this.compare(element, parent) >= 0) break

      this.heap[index] = parent
      index = parentIndex
    }
    this.heap[index] = element
  }

  private bubbleDown(): void {
    let index = 0
    const length = this.heap.length
    const element = this.heap[0]

    while (true) {
      let leftIndex = 2 * index + 1
      let rightIndex = 2 * index + 2
      let smallest = index

      if (leftIndex < length && this.compare(this.heap[leftIndex], this.heap[rightIndex]) < 0) {
        smallest = leftIndex
      }

      if (rightIndex < length && this.compare(this.heap[rightIndex], this.heap[smallest]) < 0) {
        smallest = rightIndex
      }

      if (smallest === index) break

      this.heap[index] = this.heap[smallest]
      index = smallest
    }
    this.heap[index] = element
  }
}
