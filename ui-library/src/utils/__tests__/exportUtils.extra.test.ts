import { exportToJson, importFromJson } from '../exportUtils'

describe('exportUtils extras', () => {
  beforeEach(() => {
    jest.restoreAllMocks()

    // Ensure URL helpers exist in this jsdom environment
    if (typeof (URL as any).createObjectURL !== 'function') {
      ;(URL as any).createObjectURL = jest.fn()
    }

    if (typeof (URL as any).revokeObjectURL !== 'function') {
      ;(URL as any).revokeObjectURL = jest.fn()
    }
  })

  test('exportToJson calls URL.createObjectURL and revokeObjectURL', () => {
    const spyCreate = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:1')
    const spyRevoke = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const appendSpy = jest.spyOn(document.body, 'appendChild')
    const removeSpy = jest.spyOn(document.body, 'removeChild')
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    exportToJson({ nodes: [], edges: [] })

    expect(spyCreate).toHaveBeenCalled()
    expect(spyRevoke).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()
    expect(alertSpy).not.toHaveBeenCalled()
  })

  test('exportToJson handles errors and alerts', () => {
    jest.spyOn(URL, 'createObjectURL').mockImplementation(() => { throw new Error('boom') })
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    exportToJson({ nodes: [], edges: [] })

    expect(alertSpy).toHaveBeenCalledWith('Error exporting topology')
  })

  test('importFromJson success', () => {
    // Mock FileReader to synchronously call onload with valid content
    const mockReader: any = function () {}

    mockReader.prototype.readAsText = function (_file: any) {
      this.onload({ target: { result: JSON.stringify({ nodes: [1], edges: [2] }) } })
    }

    jest.spyOn(window as any, 'FileReader').mockImplementation(() => new (mockReader as any)())

    const setNodes = jest.fn()
    const setEdges = jest.fn()
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    const fakeFile = new File([JSON.stringify({ nodes: [1], edges: [2] })], 'f.json', { type: 'application/json' })

    importFromJson(fakeFile as any, setNodes, setEdges)

    expect(setNodes).toHaveBeenCalledWith([1])
    expect(setEdges).toHaveBeenCalledWith([2])
    expect(alertSpy).toHaveBeenCalledWith('Topology imported successfully')
  })

  test('importFromJson invalid format and parse error', () => {
    // invalid format (no nodes/edges)
    const mockReader1: any = function () {}

    mockReader1.prototype.readAsText = function () {
      this.onload({ target: { result: JSON.stringify({ bad: 1 }) } })
    }

    jest.spyOn(window as any, 'FileReader').mockImplementation(() => new (mockReader1 as any)())
    const alertSpy1 = jest.spyOn(window, 'alert').mockImplementation(() => {})

    importFromJson(new File(['{}'], 'f.json') as any, jest.fn(), jest.fn())
    expect(alertSpy1).toHaveBeenCalledWith('Invalid topology file format')

    // parse error
    const mockReader2: any = function () {}

    mockReader2.prototype.readAsText = function () {
      this.onload({ target: { result: 'not json' } })
    }

    jest.spyOn(window as any, 'FileReader').mockImplementation(() => new (mockReader2 as any)())
    const alertSpy2 = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    importFromJson(new File(['{}'], 'f.json') as any, jest.fn(), jest.fn())
    expect(alertSpy2).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
