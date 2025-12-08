// SQL Injection simulation logic
// This is a completely fake simulation - no real SQL is executed

// Common SQL injection patterns that would bypass authentication
const INJECTION_PATTERNS = [
  "' OR '1'='1",
  "' OR '1'='1'--",
  "' OR '1'='1'#",
  "' OR '1'='1'/*",
  "' OR 1=1--",
  "' OR 1=1#",
  "' OR 1=1/*",
  "admin'--",
  "admin'#",
  "' OR ''='",
  "1' OR '1'='1",
  "' OR 'x'='x",
  "') OR ('1'='1",
  "') OR ('1'='1'--",
  "' OR 'a'='a",
  "') OR ('a'='a",
  "1' OR '1'='1' --",
  "' OR 'something'='something",
  "or 1=1",
  "' or 1=1--",
  "\" or 1=1--",
  "or 1=1--",
  "' or 'a'='a",
  "\" or \"a\"=\"a",
  "') or ('a'='a",
  "' or 1=1/*",
  "' or 1=1;--",
]

/**
 * Check if the input contains a SQL injection pattern
 * @param {string} input - User input to check
 * @returns {boolean} - True if injection detected
 */
export function detectSqlInjection(input) {
  if (!input) return false
  
  const normalizedInput = input.toLowerCase().trim()
  
  // Check for common patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (normalizedInput.includes(pattern.toLowerCase())) {
      return true
    }
  }
  
  // Check for general patterns that indicate injection attempts
  const generalPatterns = [
    /'\s*or\s*'.*'\s*=\s*'/i,           // ' OR 'x'='x
    /'\s*or\s*\d+\s*=\s*\d+/i,          // ' OR 1=1
    /'\s*or\s*true/i,                    // ' OR true
    /'\s*;\s*--/i,                       // '; --
    /'\s*;\s*#/i,                        // '; #
    /--\s*$/,                             // ends with --
    /#\s*$/,                              // ends with #
    /'\s*or\s*''='/i,                    // ' OR ''='
    /admin.*--/i,                         // admin'-- style
    /'\)\s*or\s*\(/i,                    // ') or (
  ]
  
  for (const regex of generalPatterns) {
    if (regex.test(normalizedInput)) {
      return true
    }
  }
  
  return false
}

/**
 * Generate the fake SQL query that would be executed
 * @param {string} username - The username input
 * @param {string} password - The password input
 * @returns {string} - The "constructed" SQL query
 */
export function generateFakeQuery(username, password) {
  const safeUsername = username || ''
  const safePassword = password || ''
  
  return `SELECT * FROM users WHERE username = '${safeUsername}' AND password = '${safePassword}';`
}

/**
 * Simulate login attempt
 * @param {string} username - The username input
 * @param {string} password - The password input
 * @returns {object} - Result with success status and message
 */
export function simulateLogin(username, password) {
  const isInjected = detectSqlInjection(username) || detectSqlInjection(password)
  
  if (isInjected) {
    return {
      success: true,
      message: 'SQL Injection detected! Login bypassed.',
      injected: true,
    }
  }
  
  // Simulate normal failed login
  return {
    success: false,
    message: 'Invalid username or password.',
    injected: false,
  }
}
