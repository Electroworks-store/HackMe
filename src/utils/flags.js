// Flag definitions for challenges
// All flags are fictional and for educational purposes only

export const FLAGS = {
  'sql-login': 'FLAG{sql_1nj3ct10n_m4st3r}',
  'idor': 'FLAG{1d0r_4cc3ss_c0ntr0l}',
  'robots-cookie': 'FLAG{c00k13_m0nst3r_4dm1n}',
}

/**
 * Get flag for a challenge
 * @param {string} challengeId - The challenge ID
 * @returns {string|null} - The flag or null if not found
 */
export function getFlag(challengeId) {
  return FLAGS[challengeId] || null
}

/**
 * Validate if a flag is correct for a challenge
 * @param {string} challengeId - The challenge ID
 * @param {string} flag - The flag to validate
 * @returns {boolean} - True if flag is correct
 */
export function validateFlag(challengeId, flag) {
  const correctFlag = FLAGS[challengeId]
  return correctFlag && flag.trim() === correctFlag
}
