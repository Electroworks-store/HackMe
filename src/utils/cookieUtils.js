// Cookie utility functions for the challenge
// These cookies are ONLY for this educational playground

const COOKIE_NAME = 'hacklab_role'

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null
 */
export function getCookie(name) {
  const cookies = document.cookie.split(';')
  
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue)
    }
  }
  
  return null
}

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration (default: 1)
 */
export function setCookie(name, value, days = 1) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * Get the current role from the hacklab cookie
 * @returns {string} - The current role (default: 'user')
 */
export function getRole() {
  return getCookie(COOKIE_NAME) || 'user'
}

/**
 * Initialize the role cookie if it doesn't exist
 * Sets role to 'user' by default
 */
export function initializeRoleCookie() {
  if (!getCookie(COOKIE_NAME)) {
    setCookie(COOKIE_NAME, 'user')
  }
}

/**
 * Check if the current role is admin
 * @returns {boolean}
 */
export function isAdmin() {
  return getRole().toLowerCase() === 'admin'
}

/**
 * Reset the role cookie to 'user'
 */
export function resetRole() {
  setCookie(COOKIE_NAME, 'user')
}
