// Flag definitions for challenges
// All flags are fictional and for educational purposes only
//
// OPERATION: FAULT LINE (PROJECT APEX)
// Each flag starts with a fragment word (ALL CAPS before first underscore).
// The 18 fragment words in challenge order spell:
// "THE PHANTOM ARCHIVE WAS NEVER MEANT TO BE FOUND
//  BUT YOU CRACKED IT ANYWAY — WELL DONE, AGENT ZERO."

export const FLAGS = {
  // Act I: The Vance Leaks
  'sql-login':          'FLAG{THE_history_cannot_b3_3ras3d}',
  'idor':               'FLAG{PHANTOM_l3ftov3r_cr3ds_found}',
  'robots-cookie':      'FLAG{ARCHIVE_sql_j3t_fu3l}',
  'localstorage-auth':  'FLAG{WAS_privil3g3_escalat3d}',
  'base64-token':       'FLAG{NEVER_trust_th3_cli3nt}',
  'js-backdoor':        'FLAG{MEANT_t0_b3_strip3d}',
  // Act II: Going Off-Grid
  'two-part-heist':     'FLAG{TO_p4ck3t_sn1ff_th3_w0rld}',
  'xor-crypto':         'FLAG{BE_w4ry_0f_bad_crypt0}',
  'hidden-message':     'FLAG{FOUND_vulner4bl3_st4g1ng}',
  'chat-lab':           'FLAG{BUT_XSS_alw4ys_w1ns}',
  'fix-the-bug':        'FLAG{YOU_know_cl34n_c0d3}',
  'metadata-heist':     'FLAG{CRACKED_th3_g30_loc4t10n}',
  // Act III: The Isolation Sandbox
  'ciphered-incident-log':       'FLAG{IT_w4s_ins1d3_all_al0ng}',
  'breached-chat-server':        'FLAG{ANYWAY_th3_f1l3_is_b4r3}',
  'operation-lost-credentials':  'FLAG{WELL_pl4y3d_k3y_sl3uth}',
  'prng-prediction':             'FLAG{DONE_with_th3_m4th}',
  'canary-flag':                 'FLAG{AGENT_sl1ps_thr0ugh_n3t}',
  'silent-record':               'FLAG{ZERO_cl34n_sl4t3_ach13v3d}',
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
