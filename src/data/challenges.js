export const challenges = [
  {
    id: 'sql-login',
    title: 'SQL Injection Login Bypass',
    shortTitle: 'SQL Injection',
    description: 'Bypass authentication using a classic SQL injection technique. Learn how malicious input can manipulate database queries.',
    difficulty: 'Beginner',
    category: 'Injection',
    path: '/challenge/sql-login',
    tutorialPath: '/tutorial/sql-login',
    estimatedTime: '5-10 min',
    skills: ['SQL basics', 'Authentication'],
    icon: '💉',
    flag: 'FLAG{sql_1nj3ct10n_m4st3r}',
  },
  {
    id: 'idor',
    title: 'Hidden Admin Page (IDOR)',
    shortTitle: 'IDOR Attack',
    description: 'Discover hidden resources by manipulating URL parameters. Understand why access control is crucial.',
    difficulty: 'Beginner',
    category: 'Access Control',
    path: '/challenge/idor?userId=1',
    tutorialPath: '/tutorial/idor',
    estimatedTime: '5-10 min',
    skills: ['URL manipulation', 'Access control'],
    icon: '🔓',
    flag: 'FLAG{1d0r_4cc3ss_c0ntr0l}',
  },
  {
    id: 'robots-cookie',
    title: 'Robots.txt + Cookie Tampering',
    shortTitle: 'Cookie Tampering',
    description: 'Find hidden clues in robots.txt and manipulate cookies to gain admin access. Learn about information disclosure.',
    difficulty: 'Beginner',
    category: 'Information Disclosure',
    path: '/challenge/robots-cookie',
    tutorialPath: '/tutorial/robots-cookie',
    estimatedTime: '10-15 min',
    skills: ['Information gathering', 'Cookie manipulation'],
    icon: '🍪',
    flag: 'FLAG{c00k13_m0nst3r_4dm1n}',
  },
  {
    id: 'localstorage-auth',
    title: 'LocalStorage Auth Bypass',
    shortTitle: 'LocalStorage Exploit',
    description: 'Exploit insecure client-side storage to bypass authentication. Learn why trusting client-side data is dangerous.',
    difficulty: 'Beginner',
    category: 'Broken Authentication',
    path: '/challenge/localstorage-auth',
    tutorialPath: '/tutorial/localstorage-auth',
    estimatedTime: '5-10 min',
    skills: ['DevTools', 'Client-side storage'],
    icon: '💾',
    flag: 'FLAG{l0c4l_st0r4g3_n0t_s3cur3}',
  },
  {
    id: 'base64-token',
    title: 'Base64 Token Decode',
    shortTitle: 'Base64 Decoding',
    description: 'Decode an intercepted authentication token to find hidden credentials. Learn that encoding is not encryption.',
    difficulty: 'Beginner',
    category: 'Cryptography',
    path: '/challenge/base64-token',
    tutorialPath: '/tutorial/base64-token',
    estimatedTime: '5-10 min',
    skills: ['Encoding basics', 'Token analysis'],
    icon: '🔐',
    flag: 'FLAG{b4s364_1s_n0t_encryp710n}',
  },
  {
    id: 'js-backdoor',
    title: 'JavaScript Backdoor',
    shortTitle: 'JS Backdoor',
    description: 'Find and exploit debug functions left in production code. Learn about code review and secure deployment.',
    difficulty: 'Beginner',
    category: 'Insecure Design',
    path: '/challenge/js-backdoor',
    tutorialPath: '/tutorial/js-backdoor',
    estimatedTime: '5-10 min',
    skills: ['Source code analysis', 'Browser console'],
    icon: '🐛',
    flag: 'FLAG{d3bug_m0d3_l3ft_0n}',
  },
]

export function getChallengeById(id) {
  return challenges.find(c => c.id === id)
}

export function getChallengeByPath(path) {
  return challenges.find(c => c.path === path)
}

export function getNextChallenge(currentId) {
  const currentIndex = challenges.findIndex(c => c.id === currentId)
  if (currentIndex === -1 || currentIndex >= challenges.length - 1) {
    return null // No next challenge
  }
  return challenges[currentIndex + 1]
}

export function isLastChallenge(currentId) {
  const currentIndex = challenges.findIndex(c => c.id === currentId)
  return currentIndex === challenges.length - 1
}

export function getTotalChallengeCount() {
  return challenges.length
}
