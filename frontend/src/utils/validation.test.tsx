import {
  validateTopologyData,
  validateEmail,
  validateUsername,
  validatePassword,
  validateIP,
  validateSubnetMask,
  validateProjectName,
  validateNodeLabel
} from './validation'

describe('validation utilities', () => {
  describe('validateEmail', () => {
    test('returns invalid for empty email', () => {
      expect(validateEmail('').valid).toBe(false)
      expect(validateEmail('   ').valid).toBe(false)
    })

    test('returns invalid for invalid email format', () => {
      expect(validateEmail('invalid').valid).toBe(false)
      expect(validateEmail('invalid@').valid).toBe(false)
      expect(validateEmail('@domain.com').valid).toBe(false)
    })

    test('returns valid for correct email', () => {
      expect(validateEmail('test@example.com').valid).toBe(true)
      expect(validateEmail('user.name@domain.co.uk').valid).toBe(true)
    })
  })

  describe('validateUsername', () => {
    test('returns invalid for empty username', () => {
      expect(validateUsername('').valid).toBe(false)
      expect(validateUsername('   ').valid).toBe(false)
    })

    test('returns invalid for too short username', () => {
      expect(validateUsername('ab').valid).toBe(false)
    })

    test('returns invalid for too long username', () => {
      expect(validateUsername('a'.repeat(21)).valid).toBe(false)
    })

    test('returns valid for correct username', () => {
      expect(validateUsername('user123').valid).toBe(true)
      expect(validateUsername('test_user').valid).toBe(true)
    })
  })

  describe('validatePassword', () => {
    test('returns invalid for empty password', () => {
      expect(validatePassword('').valid).toBe(false)
    })

    test('returns invalid for too short password', () => {
      expect(validatePassword('12345').valid).toBe(false)
    })

    test('returns valid for correct password', () => {
      expect(validatePassword('password123').valid).toBe(true)
      expect(validatePassword('123456').valid).toBe(true)
    })
  })

  describe('validateIP', () => {
    test('returns invalid for empty IP', () => {
      expect(validateIP('').valid).toBe(false)
      expect(validateIP('   ').valid).toBe(false)
    })

    test('returns invalid for invalid IP format', () => {
      expect(validateIP('invalid').valid).toBe(false)
      expect(validateIP('192.168.1').valid).toBe(false)
      expect(validateIP('192.168.1.1.1').valid).toBe(false)
    })

    test('returns invalid for out of range octets', () => {
      expect(validateIP('256.1.1.1').valid).toBe(false)
      expect(validateIP('192.300.1.1').valid).toBe(false)
      expect(validateIP('192.168.-1.1').valid).toBe(false)
    })

    test('returns valid for correct IP', () => {
      expect(validateIP('192.168.1.1').valid).toBe(true)
      expect(validateIP('10.0.0.1').valid).toBe(true)
      expect(validateIP('255.255.255.255').valid).toBe(true)
    })
  })

  describe('validateSubnetMask', () => {
    test('returns invalid for empty mask', () => {
      expect(validateSubnetMask('').valid).toBe(false)
      expect(validateSubnetMask('   ').valid).toBe(false)
    })

    test('returns invalid for invalid mask format', () => {
      expect(validateSubnetMask('invalid').valid).toBe(false)
      expect(validateSubnetMask('255.255.255').valid).toBe(false)
    })

    test('returns invalid for non-contiguous mask', () => {
      expect(validateSubnetMask('255.0.255.0').valid).toBe(false)
      expect(validateSubnetMask('192.168.1.1').valid).toBe(false)
    })

    test('returns valid for correct mask', () => {
      expect(validateSubnetMask('255.255.255.0').valid).toBe(true)
      expect(validateSubnetMask('255.255.0.0').valid).toBe(true)
      expect(validateSubnetMask('255.0.0.0').valid).toBe(true)
    })
  })

  describe('validateProjectName', () => {
    test('returns invalid for empty name', () => {
      expect(validateProjectName('').valid).toBe(false)
      expect(validateProjectName('   ').valid).toBe(false)
    })

    test('returns invalid for too long name', () => {
      expect(validateProjectName('a'.repeat(101)).valid).toBe(false)
    })

    test('returns valid for correct name', () => {
      expect(validateProjectName('My Project').valid).toBe(true)
      expect(validateProjectName('Test').valid).toBe(true)
    })
  })

  describe('validateNodeLabel', () => {
    test('returns invalid for empty label', () => {
      expect(validateNodeLabel('').valid).toBe(false)
      expect(validateNodeLabel('   ').valid).toBe(false)
    })

    test('returns invalid for too long label', () => {
      expect(validateNodeLabel('a'.repeat(51)).valid).toBe(false)
    })

    test('returns valid for correct label', () => {
      expect(validateNodeLabel('Router 1').valid).toBe(true)
      expect(validateNodeLabel('Server').valid).toBe(true)
    })
  })

  describe('validateTopologyData', () => {
    test('returns invalid for null', () => {
      expect(validateTopologyData(null).isValid).toBe(false)
    })

    test('returns invalid for missing arrays', () => {
      expect(validateTopologyData({}).isValid).toBe(false)
    })

    test('returns invalid for bad node/edge structure', () => {
      const bad = { nodes: [{ id: '1' }], edges: [{ id: 'e' }] }

      expect(validateTopologyData(bad).isValid).toBe(false)
    })

    test('valid topology passes', () => {
      const good = {
        nodes: [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
        edges: [{ id: 'e1', source: '1', target: '1' }]
      }

      expect(validateTopologyData(good).isValid).toBe(true)
    })
  })
})
