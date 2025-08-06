// Jest setup file
import '@testing-library/jest-dom'

// Mock DOM APIs for Node.js environment
global.window = global.window || {}
global.document = global.document || {
  createElement: () => ({}),
  getElementById: () => null,
  body: { appendChild: () => {} },
}

// Mock console methods to reduce noise in tests
const originalConsole = { ...console }
beforeAll(() => {
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error
})
