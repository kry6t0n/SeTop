import '@testing-library/jest-dom'

// Provide a safe mock for window.alert in jsdom environment
// so tests that trigger alerts won't crash (jsdom throws by default).
// Tests can still assert on visible error messages rendered into the DOM.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.alert = global.alert || (() => {})

// jsdom doesn't implement some URL APIs used for file exports in tests.
// Add safe shims so tests that call createObjectURL/revokeObjectURL don't throw.
// These are minimal no-op implementations that return a mock blob URL.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.URL = global.URL || {} as typeof URL
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.URL.createObjectURL = global.URL.createObjectURL || (() => 'blob:mock')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.URL.revokeObjectURL = global.URL.revokeObjectURL || (() => {})
