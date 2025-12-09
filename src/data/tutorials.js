export const tutorials = {
  'sql-login': {
    id: 'sql-login',
    title: 'SQL Injection Explained',
    sections: [
      {
        title: 'What is SQL Injection?',
        content: `SQL Injection is a code injection technique that exploits security vulnerabilities in an application's database layer. It occurs when user input is incorrectly filtered or not properly sanitized before being included in SQL queries.

When a web application takes user input and directly embeds it into an SQL query without proper validation, an attacker can manipulate the query to:
• Bypass authentication
• Access, modify, or delete data
• Execute administrative operations`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'SQL Injection Attack Flow',
              steps: [
                { label: 'Attacker', description: 'Crafts malicious input' },
                { label: 'Web Form', description: 'Accepts input without validation' },
                { label: 'Backend', description: 'Builds query with raw input' },
                { label: 'Database', description: 'Executes manipulated query' }
              ]
            }
          }
        ]
      },
      {
        title: 'How It Works',
        content: `Consider a login form that builds a query like this:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Normal Login',
              rightTitle: 'SQL Injection',
              leftCode: `// User enters: alice
// Password: secret

SELECT * FROM users 
WHERE username = 'alice' 
AND password = 'secret';

→ Returns 1 user (if valid)`,
              rightCode: `// User enters: ' OR '1'='1
// Password: anything

SELECT * FROM users 
WHERE username = '' OR '1'='1' 
AND password = '';

→ Returns ALL users!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'Key Insight',
              content: "The ' OR '1'='1 payload \"breaks out\" of the string and injects new SQL logic. Since 1=1 is always true, the WHERE clause always succeeds!"
            }
          }
        ]
      },
      {
        title: 'Why Is This Dangerous?',
        content: `In real systems, SQL injection can lead to:
• Complete database compromise
• Data theft (personal info, credit cards, passwords)
• Data manipulation or destruction
• Privilege escalation
• Full server takeover in severe cases

SQL injection has been responsible for some of the largest data breaches in history, affecting millions of users.`,
        visualComponents: [
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'Real-World Impact',
              content: 'SQL Injection has been used in major breaches affecting Sony (77M accounts), Heartland Payment Systems (130M cards), and the 2017 Equifax breach (147M people).'
            }
          }
        ]
      },
      {
        title: 'How To Prevent It',
        content: `Modern applications should use these defenses:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Vulnerable Code',
              rightTitle: 'Secure Code',
              leftCode: `// String concatenation - BAD!
const query = "SELECT * FROM users " +
  "WHERE username = '" + input + "'";

// Attacker input breaks out of string
// and modifies query logic!`,
              rightCode: `// Parameterized query - SAFE!
const query = "SELECT * FROM users " +
  "WHERE username = ?";
db.execute(query, [input]);

// Input is treated as DATA only
// Can never become SQL code!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Defense in Depth',
              content: '1. Use Parameterized Queries\n2. Input Validation & Sanitization\n3. Least Privilege DB Accounts\n4. Web Application Firewalls\n5. Regular Security Testing'
            }
          }
        ]
      },
      {
        title: 'Important Note',
        content: `This challenge simulates SQL injection for educational purposes only. The "database" and "queries" shown are completely fake JavaScript simulations.

**Never attempt SQL injection on real websites.** Unauthorized access to computer systems is illegal and unethical. Only practice on systems you own or have explicit permission to test.`
      }
    ]
  },

  'idor': {
    id: 'idor',
    title: 'IDOR (Insecure Direct Object Reference) Explained',
    sections: [
      {
        title: 'What is IDOR?',
        content: `IDOR (Insecure Direct Object Reference) is a type of access control vulnerability. It occurs when an application uses user-supplied input to directly access objects (like database records, files, or resources) without proper authorization checks.`,
        visualComponents: [
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Common IDOR Examples',
              content: '• Changing user ID in URL to access another profile\n• Modifying order number to view someone else\'s order\n• Changing file ID to download confidential documents\n• Editing record IDs in API requests'
            }
          }
        ]
      },
      {
        title: 'How It Works',
        content: `Consider a URL like /profile?userId=123. If you're logged in as user 123, you see your profile. But what if you change it?`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'IDOR Attack Flow',
              steps: [
                { label: 'User', description: 'Sees their URL: ?userId=123' },
                { label: 'Change ID', description: 'Modifies to ?userId=1' },
                { label: 'No Auth Check', description: 'Server fetches user 1' },
                { label: 'Data Leak', description: 'Attacker sees admin data!' }
              ]
            }
          },
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Your Profile',
              rightTitle: 'After Changing ID',
              leftCode: `/profile?userId=123

Returns:
{
  name: "John Doe",
  email: "john@example.com",
  role: "user"
}`,
              rightCode: `/profile?userId=1

Returns:
{
  name: "Admin",
  email: "admin@company.com",
  role: "admin",
  secretKey: "..." 
}  ← Unauthorized!`
            }
          }
        ]
      },
      {
        title: 'Why Is This Dangerous?',
        content: `IDOR vulnerabilities can lead to:
• Unauthorized access to other users' personal data
• Viewing confidential business information
• Accessing admin functionality
• Modifying or deleting other users' data
• Privacy violations and regulatory compliance issues`,
        visualComponents: [
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'OWASP Top 10',
              content: 'IDOR is part of "Broken Access Control" which is ranked #1 in the OWASP Top 10 (2021). It\'s one of the most common vulnerabilities found in web applications.'
            }
          }
        ]
      },
      {
        title: 'How To Prevent It',
        content: `Proper defenses include:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Vulnerable Code',
              rightTitle: 'Secure Code',
              leftCode: `// Server blindly trusts user input
app.get('/profile', (req, res) => {
  const userId = req.query.userId;
  // No authorization check!
  const user = db.getUser(userId);
  res.json(user);
});`,
              rightCode: `// Server validates authorization
app.get('/profile', (req, res) => {
  const userId = req.query.userId;
  // Check if logged-in user can access
  if (req.session.userId !== userId) {
    return res.status(403).json({
      error: 'Forbidden'
    });
  }
  const user = db.getUser(userId);
  res.json(user);
});`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Best Practices',
              content: '1. Always verify user authorization server-side\n2. Use indirect references (random tokens) instead of sequential IDs\n3. Implement proper Access Control Lists (ACLs)\n4. Log access attempts to detect abuse patterns'
            }
          }
        ]
      },
      {
        title: 'Important Note',
        content: `This challenge uses fake user data to demonstrate IDOR. The "admin panel" and user profiles are completely simulated.

**Never attempt to access unauthorized resources on real websites.** Accessing data without authorization is illegal, even if the technical barrier is low. Always obtain proper permission before security testing.`
      }
    ]
  },

  'robots-cookie': {
    id: 'robots-cookie',
    title: 'Robots.txt & Cookie Tampering Explained',
    sections: [
      {
        title: 'What is robots.txt?',
        content: `robots.txt is a standard text file that tells search engine crawlers which pages they can or cannot index. It's placed at the root of a website.`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Example robots.txt',
              code: `User-agent: *
Disallow: /admin/
Disallow: /secret-backup/
Disallow: /internal-tools/

# Oops, we just told attackers where the good stuff is!`,
              highlights: [
                { type: 'danger', lines: [2, 3, 4] }
              ]
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'Security Misconception',
              content: 'robots.txt is publicly accessible and is NOT a security mechanism—it\'s merely a suggestion to well-behaved bots. Attackers check it first because it reveals hidden paths!'
            }
          }
        ]
      },
      {
        title: 'What are Cookies?',
        content: `Cookies are small pieces of data stored in your browser by websites. They're commonly used for:
• Session management (keeping you logged in)
• Personalization (preferences, shopping carts)
• Tracking (analytics, advertising)

Cookies are just text stored in your browser, which means you can view and modify them using browser developer tools!`
      },
      {
        title: 'Cookie Tampering Attack',
        content: `If an application stores authorization data in cookies and trusts it without verification, attackers can modify cookies to gain elevated privileges.`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Cookie Tampering Attack',
              steps: [
                { label: 'Login', description: 'Site sets role=user cookie' },
                { label: 'DevTools', description: 'Open F12 → Application' },
                { label: 'Modify', description: 'Change role=user → role=admin' },
                { label: 'Access', description: 'Refresh page with admin access!' }
              ]
            }
          },
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Before (User)',
              rightTitle: 'After (Admin)',
              leftCode: `Cookie: hacklab_role=user

Server reads cookie:
→ role = "user"
→ Shows normal dashboard
→ No admin options`,
              rightCode: `Cookie: hacklab_role=admin

Server reads cookie:
→ role = "admin"  
→ Shows admin dashboard
→ Full access granted!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Analogy',
              content: 'This is like trusting a visitor\'s name tag at a building—anyone can write "CEO" on their own name tag!'
            }
          }
        ]
      },
      {
        title: 'Why Is This Dangerous?',
        content: `These vulnerabilities can lead to:
• Information disclosure through robots.txt
• Privilege escalation via cookie manipulation
• Bypassing client-side access controls
• Account takeover if session tokens are predictable`,
        visualComponents: [
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'Common Mistake',
              content: 'Many real-world breaches occurred because developers trusted client-side data. Remember: anything in the browser can be modified by the user!'
            }
          }
        ]
      },
      {
        title: 'How To Prevent It',
        content: `Best practices include:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Vulnerable Cookie',
              rightTitle: 'Secure Approach',
              leftCode: `// Storing role directly in cookie
setCookie('role', 'user');

// Server trusts cookie value
if (getCookie('role') === 'admin') {
  showAdminPanel();
}
// User can just change the cookie!`,
              rightCode: `// Store only session ID in cookie
setCookie('sessionId', 'abc123xyz');

// Server looks up role in database
const session = db.getSession(sessionId);
if (session.role === 'admin') {
  showAdminPanel();
}
// User can't modify server-side data!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Cookie Security Best Practices',
              content: '• Never store authorization decisions in cookies\n• Use server-side sessions with secure tokens\n• Sign cookies cryptographically (HMAC)\n• Set HttpOnly and Secure flags\n• For robots.txt: don\'t list sensitive paths—secure them properly'
            }
          }
        ]
      },
      {
        title: 'Important Note',
        content: `This challenge simulates a misconfigured application for learning purposes. The cookies and admin access are completely fake and isolated to this playground.

**In the real world:**
• Modifying cookies on sites you don't own is unauthorized access
• Accessing paths listed in robots.txt may still be illegal if not intended for you
• Always get explicit permission before security testing`
      }
    ]
  },

  'localstorage-auth': {
    id: 'localstorage-auth',
    title: 'LocalStorage Auth Bypass Tutorial',
    sections: [
      {
        title: 'What is LocalStorage?',
        content: `**LocalStorage** is a web browser feature that allows websites to store data persistently on the client side. Unlike cookies, localStorage data is not sent with HTTP requests.`,
        visualComponents: [
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'LocalStorage Characteristics',
              content: '• Data persists even after browser is closed\n• Storage limit: 5-10MB per domain\n• Accessed via: localStorage.getItem() / setItem()\n• All data stored as strings\n• Completely accessible and modifiable by the user!'
            }
          }
        ]
      },
      {
        title: 'The Vulnerability',
        content: `Many developers mistakenly use localStorage to store sensitive data like user roles, authentication status, or session tokens.`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Why This Is Dangerous',
              steps: [
                { label: 'App Stores', description: 'role: "guest" in localStorage' },
                { label: 'User Opens', description: 'DevTools (F12) → Application' },
                { label: 'User Edits', description: 'Changes "guest" to "admin"' },
                { label: 'App Trusts', description: 'Shows admin features!' }
              ]
            }
          },
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Vulnerable Pattern',
              rightTitle: 'What\'s Wrong',
              leftCode: `// BAD: Storing role in localStorage
localStorage.setItem('userRole', 'guest');

// Later, checking permissions
if (localStorage.getItem('userRole') === 'admin') {
  showAdminPanel();
}`,
              rightCode: `Problems:
1. User can open DevTools
2. See all stored data
3. Modify any value
4. No server verification

The server never validates
if the user is really admin!`
            }
          }
        ]
      },
      {
        title: 'How To Exploit It',
        content: `There are two main methods to exploit localStorage-based auth:`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Method 1: DevTools UI',
              code: `1. Open DevTools (F12)
2. Go to Application tab → Local Storage
3. Find the key storing the role
4. Double-click the value
5. Change "guest" to "admin"
6. Refresh the page`,
              highlights: []
            }
          },
          {
            type: 'CodeBlock',
            props: {
              title: 'Method 2: Console',
              code: `// Read current session
localStorage.getItem('hackme_user_session');

// Parse and modify
let session = JSON.parse(
  localStorage.getItem('hackme_user_session')
);
session.role = 'admin';

// Save modified session
localStorage.setItem(
  'hackme_user_session', 
  JSON.stringify(session)
);`,
              highlights: [
                { type: 'danger', lines: [7] }
              ]
            }
          }
        ]
      },
      {
        title: 'How To Prevent It',
        content: `**Never trust client-side storage for authorization!**`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Insecure',
              rightTitle: 'Secure',
              leftCode: `// Client stores role directly
localStorage.setItem('role', 'admin');

// Client checks its own role
if (localStorage.role === 'admin') {
  fetch('/admin/data');
}

// Server trusts the request`,
              rightCode: `// Client stores only session ID
localStorage.setItem('sessionId', 'xyz');

// Server validates session
fetch('/admin/data', {
  headers: { Auth: sessionId }
});

// Server checks: is this session admin?
// Returns 403 if not authorized`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Best Practices',
              content: '• Server-side validation for all permissions\n• Store only session IDs client-side\n• If using JWT, always verify signatures server-side\n• Cryptographically sign any client-stored data\n• Assume all client data is compromised'
            }
          }
        ]
      },
      {
        title: 'Important Note',
        content: `This challenge simulates a vulnerable application for learning. The localStorage manipulation shown here is:
• Safe within this playground
• Educational for understanding client-side security

**In the real world:**
• Modifying localStorage on sites you don't own could be unauthorized access
• Many sites properly validate server-side, so this attack won't work
• Always get explicit permission before security testing`
      }
    ]
  },

  'base64-token': {
    id: 'base64-token',
    title: 'Base64 Token Decoding Tutorial',
    sections: [
      {
        title: 'Encoding vs Encryption',
        content: `**This is a critical security concept!**`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Encoding',
              rightTitle: 'Encryption',
              leftCode: `Purpose: Transform data format
Security: NONE - anyone can decode
Reversible: Yes, by anyone
Key needed: No

Examples:
• Base64
• URL encoding
• HTML entities

Anyone with the data can decode it!`,
              rightCode: `Purpose: Protect data secrecy
Security: HIGH - needs secret key
Reversible: Only with the key
Key needed: Yes

Examples:
• AES-256
• RSA
• ChaCha20

Only key holders can decrypt!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'Critical Difference',
              content: 'Encoding: Anyone can decode it\nEncryption: Only someone with the key can decrypt it\n\nMany developers confuse these and use Base64 thinking it provides security!'
            }
          }
        ]
      },
      {
        title: 'What is Base64?',
        content: `Base64 is an encoding scheme that converts binary data to ASCII text using 64 characters (A-Z, a-z, 0-9, +, /, and = for padding).`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Base64 Example',
              code: `Original:  Hello, World!
Base64:    SGVsbG8sIFdvcmxkIQ==

Original:  {"user":"admin","role":"admin"}
Base64:    eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ==

It looks like gibberish...
but it's trivially reversible!`,
              highlights: []
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Legitimate Uses of Base64',
              content: '• Encoding binary data in JSON/XML\n• Email attachments (MIME)\n• Data URIs in HTML/CSS\n• Embedding images in code\n\nThese are fine! The problem is using it for "security".'
            }
          }
        ]
      },
      {
        title: 'Decoding Base64',
        content: `Decoding Base64 is trivially easy in any language:`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Decoding Methods',
              code: `// JavaScript (in browser console)
atob('SGVsbG8sIFdvcmxkIQ==');  // "Hello, World!"
btoa('Hello, World!');         // Encode

// Python
import base64
base64.b64decode('SGVsbG8=').decode()

// Command Line (Linux/Mac)
echo "SGVsbG8=" | base64 -d

// Online: Just Google "Base64 decoder"`,
              highlights: []
            }
          }
        ]
      },
      {
        title: 'The Vulnerability',
        content: `Developers sometimes use Base64 thinking it provides security:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'False Security',
              rightTitle: 'Attacker\'s View',
              leftCode: `// Developer thinks this is "hidden"
const token = btoa(JSON.stringify({
  username: 'admin',
  password: 'secret123',
  role: 'admin'
}));

// Sets cookie with "encrypted" token
setCookie('auth', token);`,
              rightCode: `// Attacker opens DevTools
// Finds cookie: eyJ1c2VybmFtZSI...

// Decodes in console:
atob('eyJ1c2VybmFtZSI...')

// Sees plain JSON:
{
  username: 'admin',
  password: 'secret123',  ← Leaked!
  role: 'admin'
}`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'Real-World Example: JWT Tokens',
              content: 'JWT (JSON Web Tokens) use Base64 for the header and payload! The payload is readable by anyone. The signature provides integrity, NOT confidentiality. Never put secrets in JWT payloads!'
            }
          }
        ]
      },
      {
        title: 'How To Prevent It',
        content: `**Never store secrets in client-accessible tokens!**`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Insecure Token',
              rightTitle: 'Secure Approach',
              leftCode: `// Putting role in token (BAD)
{
  user: "john",
  role: "admin",
  password: "secret"
}

// Base64 encoded
// User can decode & see everything`,
              rightCode: `// JWT with signature (BETTER)
header.payload.SIGNATURE

// Server verifies signature
// If tampered, signature fails

// Or: Keep secrets server-side
// Only send session ID to client`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Best Practices',
              content: '• Use proper encryption for sensitive data\n• Use HTTPS for all transmission\n• Keep secrets server-side only\n• Sign tokens cryptographically (HMAC/RSA)\n• Use established standards like properly-signed JWTs'
            }
          }
        ]
      },
      {
        title: 'Important Note',
        content: `This challenge demonstrates why encoding is not encryption. The token you decoded is completely simulated for learning purposes.

**In the real world:**
• Many real tokens are Base64 encoded (including JWTs)
• Decoding them is not illegal - they're meant to be readable
• MODIFYING them and using them maliciously could be illegal
• Always get permission before security testing`
      }
    ]
  },

  'js-backdoor': {
    id: 'js-backdoor',
    title: 'JavaScript Backdoor Tutorial',
    sections: [
      {
        title: 'What Are Debug Backdoors?',
        content: `During development, programmers often add **debug functions** to make testing easier. The problem is these often get accidentally deployed to production!`,
        visualComponents: [
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'Common Debug Functions Left Behind',
              content: '• Quick login functions that bypass authentication\n• Admin access shortcuts\n• Feature flags and toggles\n• Console logging of sensitive data\n• Hidden API endpoints\n• Test accounts with weak passwords'
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Why This Happens',
              content: '1. "We\'ll remove it later" (and never do)\n2. Build process doesn\'t strip dev code\n3. Minification makes devs think code is hidden\n4. No code review for debug artifacts\n5. Forgotten during deadline crunch'
            }
          }
        ]
      },
      {
        title: 'Finding Debug Functions',
        content: `Attackers look for debug code in several ways:`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Debug Function Discovery',
              steps: [
                { label: 'View Source', description: 'Read/beautify JavaScript' },
                { label: 'Search', description: 'Look for debug/admin/test' },
                { label: 'Analyze', description: 'Find hardcoded passwords' },
                { label: 'Execute', description: 'Call function in console' }
              ]
            }
          },
          {
            type: 'CodeBlock',
            props: {
              title: 'Searching for Backdoors',
              code: `// In browser console, check global objects:
Object.keys(window).filter(k => 
  k.includes('debug') || 
  k.includes('admin') ||
  k.includes('test')
);

// Try common names:
window.debug
window.admin
window.devMode
window.grantAccess
window.enableAdmin`,
              highlights: []
            }
          }
        ]
      },
      {
        title: 'The Vulnerability',
        content: `Example of vulnerable code that might be left in production:`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Vulnerable Debug Code',
              code: `// Developer added for testing
window.debugMode = function(password) {
  if (password === 'letmein') {
    window.isAdmin = true;
    window.grantAccess = function() {
      // Bypass all auth checks...
      showAdminPanel();
    };
  }
};

// Problems:
// 1. Hardcoded password in client code
// 2. Anyone can read the password
// 3. Function exists in production
// 4. No server-side validation`,
              highlights: [
                { type: 'danger', lines: [3, 4, 5, 6, 7, 8] }
              ]
            }
          }
        ]
      },
      {
        title: 'How To Exploit It',
        content: `Once you find a debug function, exploitation is straightforward:`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Exploitation Steps',
              steps: [
                { label: 'Find Code', description: 'Sources tab, beautify JS' },
                { label: 'Read Logic', description: 'Find password/conditions' },
                { label: 'Execute', description: 'Call function in console' },
                { label: 'Access', description: 'Use granted permissions' }
              ]
            }
          },
          {
            type: 'CodeBlock',
            props: {
              title: 'Example Exploitation',
              code: `// Step 1: Found these in source code
// Step 2: Understand the logic

// Step 3: In browser console:
appInfo();           // Get version info
debugMode('letmein'); // Activate backdoor
grantAccess();       // Get admin access

// Step 4: You now have admin!`,
              highlights: [
                { type: 'danger', lines: [5, 6, 7] }
              ]
            }
          }
        ]
      },
      {
        title: 'How To Prevent It',
        content: `Best practices for production code:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Dangerous',
              rightTitle: 'Safe',
              leftCode: `// Debug code always present
window.debugMode = function() {
  grantAdmin();
};

// Just minified, not removed
// Attackers can still find it!`,
              rightCode: `// Use build-time removal
if (process.env.NODE_ENV === 'dev') {
  window.debugMode = function() {
    grantAdmin();
  };
}

// Build tool removes in production`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Prevention Best Practices',
              content: '• Use build tools to strip debug code\n• Code review for debug patterns\n• Linting rules to catch debug code\n• Never hardcode secrets client-side\n• Use server-side feature flags\n• Require auth for any debug features'
            }
          }
        ]
      },
      {
        title: 'Important Note',
        content: `This challenge simulates a common real-world vulnerability. The debug functions are intentionally placed for learning purposes.

**In the real world:**
• Searching for debug functions is often the first step in bug bounties
• Reporting debug backdoors responsibly can earn rewards
• Exploiting backdoors without permission is illegal
• Many major applications have had this vulnerability

**Famous examples:**
• Video game consoles often have debug menus
• IoT devices frequently have hardcoded debug passwords
• Enterprise software sometimes has "vendor support" backdoors`
      }
    ]
  },
  'two-part-heist': {
    id: 'two-part-heist',
    title: 'The Two-Part Heist Explained',
    sections: [
      {
        title: 'What is Multi-Stage Exploitation?',
        content: `Real-world attacks often combine multiple vulnerabilities to achieve their goal. This challenge teaches you to think like an attacker who chains bugs together.

In this heist, you combine:
• **Stage 1: Reconnaissance via SQL Injection** - Leak data you shouldn't see
• **Stage 2: Business Logic Exploitation** - Abuse flawed application logic`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Multi-Stage Attack Flow',
              steps: [
                { label: 'Recon', description: 'SQL injection reveals internal accounts' },
                { label: 'Analyze', description: 'Identify interesting targets' },
                { label: 'Exploit', description: 'Abuse transfer logic flaw' },
                { label: 'Profit', description: 'Steal coins from the bank' }
              ]
            }
          }
        ]
      },
      {
        title: 'Stage 1: SQL Injection for Reconnaissance',
        content: `The wallet database query is vulnerable to SQL injection. Instead of just bypassing authentication, you use it to extract information.`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Normal Query',
              rightTitle: 'Injection Attack',
              leftCode: "-- User enters: alice\nSELECT username, coins, notes\nFROM wallets\nWHERE username = 'alice'\n\n→ Returns only alice's data",
              rightCode: "-- User enters: ' OR '1'='1\nSELECT username, coins, notes\nFROM wallets\nWHERE username = '' OR '1'='1'\n\n→ Returns ALL wallet data!\n   Including internal accounts..."
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'Key Discovery',
              content: 'The injection reveals a special internal account called "bank" with 99,999 coins. This is your target for Stage 2!'
            }
          }
        ]
      },
      {
        title: 'Stage 2: Business Logic Flaw',
        content: `The transfer system has a critical flaw: it doesn't properly validate negative amounts!

When you transfer a negative amount TO the bank:
• The system subtracts a negative from your balance
• Subtracting a negative = adding a positive
• You gain coins instead of losing them!`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Normal Transfer',
              rightTitle: 'Exploited Transfer',
              leftCode: "Transfer: 10 coins to bob\nYour balance: 5 coins\n\nbalance = 5 - 10\nERROR: Insufficient funds!",
              rightCode: "Transfer: -10000 coins to bank\nYour balance: 5 coins\n\nbalance = 5 - (-10000)\nbalance = 5 + 10000\nbalance = 10005 coins! 💰"
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'The Bug',
              content: 'The system only checks if you have enough coins for positive transfers. It never validates that amounts must be positive, allowing negative transfers that credit your account!'
            }
          }
        ]
      },
      {
        title: 'Prevention',
        content: `Both vulnerabilities have straightforward fixes:`,
        visualComponents: [
          {
            type: 'KeyTakeaways',
            props: {
              title: 'How to Prevent These Bugs',
              points: [
                'Use parameterized queries to prevent SQL injection',
                'Validate all numeric inputs (amount > 0)',
                'Never trust client-side data for security decisions',
                'Implement server-side validation for ALL business logic',
                'Test edge cases: negative numbers, zero, large values',
                'Use allowlists for transfer destinations'
              ]
            }
          }
        ]
      },
      {
        title: 'Real-World Examples',
        content: `**Business logic flaws are everywhere:**

• **Bitcoin exchanges** have lost millions to similar bugs where negative trades credited accounts
• **Gaming platforms** often have economy bugs with negative item quantities
• **Banking apps** must carefully validate all transaction amounts
• **E-commerce sites** have had bugs where negative quantities gave refunds

**Why these bugs exist:**
• Developers focus on "happy path" (positive numbers)
• Edge cases like negatives, zeros, and overflows get overlooked
• Validation is added on the client but not the server
• Business logic is complex and hard to test completely`
      }
    ]
  },
  'xor-crypto': {
    id: 'xor-crypto',
    title: 'XOR Cryptography Explained',
    sections: [
      {
        title: 'What is XOR?',
        content: `XOR (Exclusive OR) is a fundamental binary operation. For each bit position:
• 0 XOR 0 = 0
• 0 XOR 1 = 1
• 1 XOR 0 = 1
• 1 XOR 1 = 0

The key property: **XOR is its own inverse!**
If A XOR B = C, then C XOR B = A`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'XOR in Action',
              code: "Message:  01001000  (H = 72)\nKey:      01000010  (B = 66)\n──────────────────────────\nXOR:      00001010  (encrypted)\n\nEncrypted: 00001010\nKey:       01000010  (B = 66)\n──────────────────────────\nXOR:       01001000  (H = 72 - back!)"
            }
          }
        ]
      },
      {
        title: 'Why Simple XOR is Weak',
        content: `While XOR is used in real cryptography, using it alone with a simple key is extremely weak:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Weak XOR Cipher',
              rightTitle: 'Real Encryption (AES)',
              leftCode: "• Single-byte key = 256 possibilities\n• Can brute force in milliseconds\n• Patterns in plaintext visible\n• Same key XOR = same output\n• No authentication",
              rightCode: "• 256-bit key = 2^256 possibilities\n• Cannot brute force\n• Output looks random\n• Different ciphertext each time\n• Built-in authentication"
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'Critical Weakness',
              content: 'A single-byte key has only 256 possible values. An attacker can try all of them in a fraction of a second! This is why real encryption uses keys of 128-256 bits.'
            }
          }
        ]
      },
      {
        title: 'Breaking the Cipher',
        content: `To break a single-byte XOR cipher:

1. **Brute Force**: Try all 256 possible keys
2. **Look for Readable Output**: The correct key produces readable ASCII
3. **Frequency Analysis**: In longer texts, compare letter frequencies to expected patterns

In this challenge, you simply try different keys until the output makes sense. Real attackers automate this!`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Automated Brute Force',
              code: "// JavaScript brute force\nfor (let key = 0; key < 256; key++) {\n  const decoded = ciphertext.map(b => b ^ key);\n  const text = String.fromCharCode(...decoded);\n  \n  // Check if it looks like text\n  if (isPrintableASCII(text)) {\n    console.log('Key ' + key + ': ' + text);\n  }\n}"
            }
          }
        ]
      },
      {
        title: 'Real Cryptography',
        content: `Modern encryption is far more sophisticated:`,
        visualComponents: [
          {
            type: 'KeyTakeaways',
            props: {
              title: 'Proper Cryptography Principles',
              points: [
                'NEVER roll your own crypto - use established libraries',
                'Use modern algorithms: AES-256, ChaCha20',
                'Generate keys with secure random number generators',
                'Use proper modes: GCM for authenticated encryption',
                'Store passwords with bcrypt/argon2, not encryption',
                'XOR is a building block, not a complete solution'
              ]
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Rule of Thumb',
              content: "If you can understand how your encryption works completely, it's probably not secure. Real cryptographic algorithms are designed by experts and reviewed for years before being trusted."
            }
          }
        ]
      },
      {
        title: 'Historical Context',
        content: `**Simple XOR has been broken since the dawn of computing:**

• The Vigenère cipher (1553) was considered "unbreakable" but fell to frequency analysis
• German WWII Lorenz cipher used XOR but was broken at Bletchley Park
• Many early software programs used XOR for "copy protection" - always cracked

**Modern misuses still happen:**
• IoT devices often use simple XOR for "encryption"
• Malware sometimes XORs payloads to avoid detection
• Poorly designed apps store passwords XORed with a fixed key

**The lesson:** Security through obscurity doesn't work. Use proven cryptographic libraries!`
      }
    ]
  }
}

export function getTutorialById(id) {
  return tutorials[id] || null
}
