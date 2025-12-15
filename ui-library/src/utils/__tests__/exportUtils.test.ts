/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import { exportToJson, importFromJson } from '../exportUtils'

describe('exportUtils', () => {
  beforeEach(() => {
    // mock URL.createObjectURL/revoke
    // @ts-ignore
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')
    // @ts-ignore
    global.URL.revokeObjectURL = jest.fn()
  })

  test('exportToJson creates and clicks an anchor and revokes url', () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild')
    const removeSpy = jest.spyOn(document.body, 'removeChild')

    // create a fake anchor click
    const originalCreateElement = document.createElement.bind(document)

    jest.spyOn(document, 'createElement').mockImplementation((tagName: any) => {
      const el = originalCreateElement(tagName)

      // ensure click exists and is spyable
      // @ts-ignore
      el.click = jest.fn()

      return el
    })

    exportToJson({ nodes: [{ id: 'n1' }], edges: [] })

    expect((global as any).URL.createObjectURL).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalled()
    // @ts-ignore
    const anchor = document.body.querySelector('a')

    expect(anchor).toBeNull() // anchor should be removed after click
    expect((global as any).URL.revokeObjectURL).toHaveBeenCalled()

    // restore mocks
    ;(document.createElement as any).mockRestore()
    appendSpy.mockRestore()
    removeSpy.mockRestore()
  })

  test('importFromJson reads file and calls callbacks', (done) => {
    // Mock FileReader to call onload synchronously
    class FakeReader {
      onload: ((e: any) => void) | null = null
      readAsText(_file: File) {
        const event = { target: { result: JSON.stringify({ nodes: [{ id: 'n1' }], edges: [] }) } }

        if (this.onload) this.onload(event as any)
      }
    }

    // @ts-ignore
    const origFileReader = global.FileReader

    // @ts-ignore
    global.FileReader = FakeReader

    const file = new File([JSON.stringify({ nodes: [{ id: 'n1' }], edges: [] })], 't.json', { type: 'application/json' })
    const setNodes = jest.fn((nodes) => {
      expect(nodes).toEqual([{ id: 'n1' }])
    })
    const setEdges = jest.fn((edges) => {
      expect(edges).toEqual([])
      // restore
      // @ts-ignore
      global.FileReader = origFileReader
      done()
    })

    // suppress alerts
    const origAlert = global.alert

    // @ts-ignore
    global.alert = jest.fn()

    importFromJson(file, setNodes as any, setEdges as any)

    // restore alert
    // @ts-ignore
    global.alert = origAlert
  })
})
