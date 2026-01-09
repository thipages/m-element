/**
 * Zero-Dependency Test Framework
 * Works in both Node.js and browser environments
 * ~150 lines of minimal, focused testing utilities
 */

// ANSI color codes for terminal output (Node.js only)
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node
const colors = isNode ? {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
} : {
  reset: '', bright: '', red: '', green: '', yellow: '', cyan: '', gray: ''
}

// Test state
let currentSuite = null
let testResults = []
let beforeEachFns = []
let afterEachFns = []

/**
 * Define a test suite
 */
export function describe(name, fn) {
  const previousSuite = currentSuite
  currentSuite = { name, tests: [], passed: 0, failed: 0 }
  beforeEachFns = []
  afterEachFns = []
  
  try {
    fn()
  } catch (error) {
    console.error(`${colors.red}Suite "${name}" failed to execute:${colors.reset}`, error)
  }
  
  // Run tests and collect results
  testResults.push(currentSuite)
  currentSuite = previousSuite
}

/**
 * Define a test case
 */
export function it(description, fn) {
  if (!currentSuite) {
    throw new Error('it() must be called inside describe()')
  }

  const test = { description, passed: false, error: null }
  
  try {
    // Run beforeEach hooks
    beforeEachFns.forEach(hook => hook())
    
    // Run test
    fn()
    
    // Run afterEach hooks
    afterEachFns.forEach(hook => hook())
    
    test.passed = true
    currentSuite.passed++
  } catch (error) {
    test.error = error
    currentSuite.failed++
  }
  
  currentSuite.tests.push(test)
}

/**
 * Hook to run before each test
 */
export function beforeEach(fn) {
  beforeEachFns.push(fn)
}

/**
 * Hook to run after each test
 */
export function afterEach(fn) {
  afterEachFns.push(fn)
}

// Assertions
export function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`
    )
  }
}

export function assertNotEqual(actual, expected, message = '') {
  if (actual === expected) {
    throw new Error(
      message || `Expected values to be different, but both are ${JSON.stringify(actual)}`
    )
  }
}

export function assertTrue(value, message = '') {
  if (value !== true) {
    throw new Error(message || `Expected true but got ${JSON.stringify(value)}`)
  }
}

export function assertFalse(value, message = '') {
  if (value !== false) {
    throw new Error(message || `Expected false but got ${JSON.stringify(value)}`)
  }
}

export function assertExists(value, message = '') {
  if (value === null || value === undefined) {
    throw new Error(message || `Expected value to exist but got ${value}`)
  }
}

export function assertNull(value, message = '') {
  if (value !== null) {
    throw new Error(message || `Expected null but got ${JSON.stringify(value)}`)
  }
}

export function assertUndefined(value, message = '') {
  if (value !== undefined) {
    throw new Error(message || `Expected undefined but got ${JSON.stringify(value)}`)
  }
}

export function assertThrows(fn, expectedError, message = '') {
  let thrown = false
  let error = null
  
  try {
    fn()
  } catch (e) {
    thrown = true
    error = e
  }
  
  if (!thrown) {
    throw new Error(message || 'Expected function to throw an error')
  }
  
  if (expectedError && !(error instanceof expectedError)) {
    throw new Error(
      message || `Expected error of type ${expectedError.name} but got ${error.constructor.name}`
    )
  }
}

export async function assertAsyncThrows(fn, expectedError, message = '') {
  let thrown = false
  let error = null
  
  try {
    await fn()
  } catch (e) {
    thrown = true
    error = e
  }
  
  if (!thrown) {
    throw new Error(message || 'Expected async function to throw an error')
  }
  
  if (expectedError && !(error instanceof expectedError)) {
    throw new Error(
      message || `Expected error of type ${expectedError.name} but got ${error.constructor.name}`
    )
  }
}

export function assertDeepEqual(actual, expected, message = '') {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  
  if (actualStr !== expectedStr) {
    throw new Error(
      message || `Expected ${expectedStr} but got ${actualStr}`
    )
  }
}

/**
 * Print test results
 */
export function printResults() {
  if (!isNode) {
    // Browser output
    console.log('Test results:', testResults)
    return
  }

  // Node.js colored output
  console.log('\n' + colors.bright + 'Test Results' + colors.reset + '\n')
  
  let totalPassed = 0
  let totalFailed = 0
  
  testResults.forEach(suite => {
    const suiteStatus = suite.failed === 0 ? colors.green + '✓' : colors.red + '✗'
    console.log(`${suiteStatus} ${colors.bright}${suite.name}${colors.reset} (${suite.passed}/${suite.tests.length})`)
    
    suite.tests.forEach(test => {
      const status = test.passed ? colors.green + '  ✓' : colors.red + '  ✗'
      console.log(`${status} ${test.description}${colors.reset}`)
      
      if (test.error) {
        console.log(`    ${colors.red}${test.error.message}${colors.reset}`)
        if (test.error.stack) {
          console.log(`    ${colors.gray}${test.error.stack.split('\n').slice(1, 3).join('\n    ')}${colors.reset}`)
        }
      }
    })
    
    console.log('')
    totalPassed += suite.passed
    totalFailed += suite.failed
  })
  
  const totalColor = totalFailed === 0 ? colors.green : colors.red
  console.log(`${totalColor}${colors.bright}Total: ${totalPassed} passed, ${totalFailed} failed${colors.reset}\n`)
  
  // Exit with error code if tests failed (Node.js only)
  if (isNode && totalFailed > 0) {
    process.exitCode = 1
  }
}

/**
 * Run tests (auto-invoked in Node.js)
 */
if (isNode) {
  // In Node.js, automatically print results after all test files are loaded
  // This uses a setTimeout to allow all imports to complete
  setTimeout(() => {
    if (testResults.length > 0) {
      printResults()
    }
  }, 100)
}
