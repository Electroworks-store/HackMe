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
                { label: 'Recon', description: 'SQL injection reveals internal accounts', icon: 'search' },
                { label: 'Analyze', description: 'Identify interesting targets', icon: 'target' },
                { label: 'Exploit', description: 'Abuse transfer logic flaw', icon: 'zap' },
                { label: 'Profit', description: 'Steal coins from the bank', icon: 'coins' }
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
            type: 'CodeBlock',
            props: {
              title: 'The Leaked Data',
              code: "╔═══════════════════════════════════════╗\n║     WALLET DATABASE DUMP              ║\n╠═══════════╦═════════╦═════════════════╣\n║ username  ║ coins   ║ notes           ║\n╠═══════════╬═════════╬═════════════════╣\n║ alice     ║ 100     ║ Regular user    ║\n║ bob       ║ 250     ║ Regular user    ║\n║ bank      ║ 99,999  ║ INTERNAL ONLY   ║ ← Target!\n╚═══════════╩═════════╩═════════════════╝"
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
              rightCode: "Transfer: -10000 coins to bank\nYour balance: 5 coins\n\nbalance = 5 - (-10000)\nbalance = 5 + 10000\nbalance = 10005 coins!"
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
            type: 'FlowDiagram',
            props: {
              title: 'XOR Encryption & Decryption',
              steps: [
                { label: 'Plaintext', description: '"Hello" (bytes)', icon: 'file-text' },
                { label: 'XOR', description: 'XOR Key (0x42)', icon: 'key' },
                { label: 'Ciphertext', description: 'Scrambled bytes', icon: 'lock' },
                { label: 'XOR', description: 'XOR Same Key!', icon: 'key' },
                { label: 'Plaintext', description: '"Hello" again', icon: 'file-text' }
              ]
            }
          },
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
        title: 'Building a Brute Force Attack',
        content: `To crack a single-byte XOR cipher, you need to build a tool that systematically tries all 256 possible keys. The algorithm has four steps:`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Brute Force Algorithm',
              steps: [
                { label: 'Loop', description: 'Try keys 0-255', icon: 'repeat' },
                { label: 'XOR', description: 'Decrypt with key', icon: 'shuffle' },
                { label: 'Check', description: 'Is it readable?', icon: 'search' },
                { label: 'Store', description: 'Save good results', icon: 'save' }
              ]
            }
          },
          {
            type: 'CodeBlock',
            props: {
              title: 'Brute Force Implementation',
              code: "// The complete brute force tool\nfunction bruteForceXOR(ciphertext) {\n  const results = [];\n  \n  // Step 1: Loop through all 256 keys\n  for (let key = 0; key <= 255; key++) {\n    \n    // Step 2: XOR decrypt\n    const decrypted = ciphertext.map(b => b ^ key);\n    const text = String.fromCharCode(...decrypted);\n    \n    // Step 3: Check readability\n    if (isReadable(text)) {\n      \n      // Step 4: Save result\n      results.push({ key, text, score: scoreText(text) });\n    }\n  }\n  \n  return results.sort((a, b) => b.score - a.score);\n}"
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
  },
  'hidden-message': {
    id: 'hidden-message',
    title: 'DOM Manipulation & DevTools',
    sections: [
      {
        title: 'What is DOM Manipulation?',
        content: `The DOM (Document Object Model) is the browser's representation of a web page as a tree of objects. Every element on a page - every div, button, and image - is a node in this tree.

**Key insight:** The DOM exists entirely in the browser. Attackers can modify it freely using DevTools, bypassing any visual restrictions imposed by the page.

This is why you should NEVER rely on client-side controls for security!`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'DOM Attack Flow',
              steps: [
                { label: 'Inspect', description: 'Open DevTools, examine page structure' },
                { label: 'Identify', description: 'Find security controls (overlays, hidden data)' },
                { label: 'Modify', description: 'Delete, edit, or manipulate DOM elements' },
                { label: 'Exploit', description: 'Access hidden content or bypass restrictions' }
              ]
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'Security Principle',
              content: 'Never trust the client. Any security check that only happens in the browser can be bypassed. Always validate on the server.'
            }
          }
        ]
      },
      {
        title: 'Using DevTools Elements Panel',
        content: `The Elements panel in DevTools lets you:

• **Inspect** any element on the page
• **Delete** elements (like overlays blocking content)
• **Edit** HTML and CSS in real-time
• **Add** new elements

**To remove an overlay:**
1. Open DevTools (F12)
2. Click the Elements tab
3. Use the selector tool (top-left arrow) to click the overlay
4. Press Delete or right-click → "Delete element"`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Before: Blocked',
              rightTitle: 'After: Revealed',
              leftCode: `<div class="content">
  <div class="overlay">
    [CLASSIFIED]
    <!-- Blocks entire view -->
  </div>
  <p>Secret data here...</p>
</div>`,
              rightCode: `<div class="content">
  <!-- overlay DELETED! -->
  
  <p>Secret data here...</p>
  <!-- Now visible -->
</div>`
            }
          }
        ]
      },
      {
        title: 'Base64 Encoding',
        content: `**Base64** is an encoding scheme that converts binary data to ASCII text. It's commonly used for:

• Embedding images in HTML/CSS
• Encoding data in URLs
• Transmitting binary over text-only protocols

**It is NOT encryption!** Anyone can decode Base64.

To decode in the browser console:`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Encoded (Base64)',
              rightTitle: 'Decoded (Plaintext)',
              leftCode: `aGFja2xhYi1zZWNyZXQ=

SGFja01lIExhYiBGbGFn

VG9wIFNlY3JldCBQYXNzd29yZA==`,
              rightCode: `hacklab-secret

HackMe Lab Flag

Top Secret Password

// atob() decodes instantly!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Browser Console Commands',
              content: "atob('encoded_string') → decode Base64\nbtoa('plain_string') → encode to Base64\n\nThese are built into every browser!"
            }
          }
        ]
      },
      {
        title: 'Exploiting Debug Functions',
        content: `Developers often leave debug functions in production code. These might be:

• Secret admin functions
• Logging utilities
• Test backdoors
• Undocumented API endpoints

**How to find them:**
1. Check the Console for hints
2. Search the page source for "debug", "test", "admin", "secret"
3. Look at network requests
4. Explore the window object: \`Object.keys(window)\`

In this challenge, \`window.revealSecret()\` is an exposed debug function!`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Finding Hidden Functions',
              code: `// List all custom properties on window
Object.keys(window).filter(key => 
  typeof window[key] === 'function' &&
  !key.startsWith('webkit')
)

// Search for suspicious patterns
document.body.innerHTML.match(/debug|secret|admin/gi)

// Check for exposed APIs
console.dir(window.revealSecret) // Found it!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'Real-World Impact',
              content: 'Debug functions in production have led to many security breaches. Always remove or disable debug code before deploying!'
            }
          }
        ]
      },
      {
        title: 'Solving the Challenge',
        content: `This challenge requires chaining three techniques together:`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Multi-Stage Attack',
              steps: [
                { label: 'Stage 1', description: 'Delete overlay element', icon: 'trash-2' },
                { label: 'Stage 2', description: 'Decode Base64 token', icon: 'unlock' },
                { label: 'Stage 3', description: 'Call debug function', icon: 'terminal' },
                { label: 'Flag!', description: 'Secret revealed', icon: 'flag' }
              ]
            }
          },
          {
            type: 'CodeBlock',
            props: {
              title: 'Complete Solution',
              code: `// Stage 1: In Elements panel, delete:
// <div class="classified-overlay">...</div>

// Stage 2: Decode the visible Base64 token
const token = atob("aGFja2xhYi1zZWNyZXQtdG9rZW4tMTMzNw==")
// Result: "hacklab-secret-token-1337"

// Stage 3: Call the exposed function
window.revealSecret(token)
// Flag revealed!`
            }
          },
          {
            type: 'KeyTakeaways',
            props: {
              title: 'Key Takeaways',
              points: [
                'DOM manipulation lets attackers bypass visual controls',
                'Base64 is encoding, NOT encryption - anyone can decode it',
                'Debug functions should never exist in production code',
                'Security must be enforced server-side, not just in the browser',
                'Browser DevTools are essential security testing tools'
              ]
            }
          }
        ]
      }
    ]
  },

  'chat-lab': {
    id: 'chat-lab',
    title: 'XSS & Message Spoofing in Chat Apps',
    sections: [
      {
        title: 'What is XSS (Cross-Site Scripting)?',
        content: `XSS is a vulnerability where an attacker injects malicious scripts into web pages viewed by other users. When the victim's browser executes the injected script, the attacker can:

• Steal session cookies
• Capture keystrokes
• Redirect users to malicious sites
• Modify page content
• Perform actions as the victim`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'XSS Attack Flow',
              steps: [
                { label: 'Inject', description: 'Attacker enters malicious script' },
                { label: 'Store', description: 'App saves input without sanitizing' },
                { label: 'Render', description: 'Victim loads page with script' },
                { label: 'Execute', description: 'Script runs in victim browser' }
              ]
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'Types of XSS',
              content: 'Stored XSS: Persisted in database, affects all viewers\nReflected XSS: Returned in response, requires victim to click link\nDOM-based XSS: Manipulates client-side JavaScript'
            }
          }
        ]
      },
      {
        title: 'Chat Apps & XSS',
        content: `Chat applications are particularly vulnerable to XSS because they:

• Display user-generated content constantly
• Often allow rich formatting (HTML, markdown)
• Have real-time updates that might bypass sanitization
• Support features like nicknames that get displayed

In this challenge, the nickname field is vulnerable. Whatever you enter gets rendered as HTML!`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Safe Input',
              rightTitle: 'XSS Payload',
              leftCode: `Nickname: Alice

Rendered as:
<span class="sender">Alice</span>

→ Normal display`,
              rightCode: `Nickname: <img src=x onerror=alert(1)>

Rendered as:
<span class="sender">
  <img src=x onerror=alert(1)>
</span>

→ Script executes!`
            }
          }
        ]
      },
      {
        title: 'Message Spoofing',
        content: `Beyond XSS, many chat apps expose JavaScript APIs for sending messages. If these APIs lack proper validation, attackers can:

• Send messages as other users
• Impersonate system accounts
• Inject fake admin announcements
• Manipulate conversation history`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Exploiting Chat APIs',
              code: `// Normal usage (your account)
window.chatApi.sendMessage({
  text: "Hello!"
});

// Spoofed message (as SYSTEM)
window.chatApi.sendMessage({
  sender: "SYSTEM",
  text: "Maintenance in 5 minutes"
});

// Users see a fake system message!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'The Bug',
              content: 'The API trusts the sender field from the client. Real apps should enforce sender identity server-side based on the authenticated session.'
            }
          }
        ]
      },
      {
        title: 'Defense Strategies',
        content: `Protecting chat applications requires multiple layers:`,
        visualComponents: [
          {
            type: 'KeyTakeaways',
            props: {
              title: 'Security Best Practices',
              points: [
                'Sanitize ALL user input before displaying (escape HTML entities)',
                'Use Content Security Policy (CSP) headers to block inline scripts',
                'Validate sender identity server-side, never trust client data',
                'Implement rate limiting to prevent spam/abuse',
                'Use allowlists for any HTML formatting allowed',
                'Log and monitor for suspicious patterns'
              ]
            }
          },
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Vulnerable',
              rightTitle: 'Secure',
              leftCode: `// Direct HTML insertion
element.innerHTML = userInput;

// Trusting client sender
const msg = {
  sender: req.body.sender,
  text: req.body.text
};`,
              rightCode: `// Escaped output
element.textContent = userInput;

// Server-enforced sender
const msg = {
  sender: req.session.username,
  text: sanitize(req.body.text)
};`
            }
          }
        ]
      }
    ]
  },

  'fix-the-bug': {
    id: 'fix-the-bug',
    title: 'Defensive Security: Fixing Vulnerabilities',
    sections: [
      {
        title: 'Thinking Like a Defender',
        content: `Most security training focuses on attacking. But real security work is about defense—finding and fixing vulnerabilities before attackers exploit them.

**Defender mindset:**
• What could go wrong?
• How might an attacker abuse this?
• What assumptions am I making?
• Is input validated everywhere needed?`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Security Review Process',
              steps: [
                { label: 'Identify', description: 'Find potential vulnerability' },
                { label: 'Analyze', description: 'Understand the risk' },
                { label: 'Fix', description: 'Implement secure solution' },
                { label: 'Test', description: 'Verify the fix works' }
              ]
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'Code Review Questions',
              content: '• Does this code trust user input?\n• Are comparisons correct (= vs ==)?\n• Can negative/zero values cause issues?\n• Are SQL queries parameterized?\n• Can paths escape their boundaries?'
            }
          }
        ]
      },
      {
        title: 'Common Bug Pattern: Assignment vs Comparison',
        content: `One of the most dangerous typos in programming: using = instead of == in conditions.`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'BUGGY (Assignment)',
              rightTitle: 'CORRECT (Comparison)',
              leftCode: `if (user.password = input) {
  // This ASSIGNS input to password
  // Then checks if result is truthy
  // ANY non-empty input passes!
  grantAccess();
}`,
              rightCode: `if (user.password == input) {
  // This COMPARES values
  // Only passes if they match
  // Secure authentication
  grantAccess();
}`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'Why This Is Dangerous',
              content: 'Assignment (=) returns the assigned value. Any non-empty string is truthy. So user.password = "anything" returns "anything" which is truthy, bypassing auth!'
            }
          }
        ]
      },
      {
        title: 'SQL Injection Prevention',
        content: `Never build SQL queries with string concatenation. Use parameterized queries instead.`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Vulnerable',
              rightTitle: 'Secure',
              leftCode: `// String concatenation = DANGER
const query = 
  "SELECT * FROM users " +
  "WHERE id = " + userId;

// Attacker input: 1 OR 1=1
// Becomes: WHERE id = 1 OR 1=1
// Returns ALL users!`,
              rightCode: `// Parameterized query = SAFE
const query = 
  "SELECT * FROM users " +
  "WHERE id = ?";

db.execute(query, [userId]);

// User input is treated as DATA
// Never as SQL code`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'info',
              title: 'The ? Placeholder',
              content: 'The ? is a parameter placeholder. The database driver safely escapes the value, ensuring it can never be interpreted as SQL code.'
            }
          }
        ]
      },
      {
        title: 'Path Traversal Prevention',
        content: `Path traversal attacks use sequences like ../ to escape intended directories.`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'The Attack',
              code: `// User requests: ../../../etc/passwd
const path = "/uploads/" + userInput;
// Becomes: /uploads/../../../etc/passwd
// Resolves to: /etc/passwd

// Attacker reads system files!`
            }
          },
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Vulnerable',
              rightTitle: 'Secure',
              leftCode: `function getFile(name) {
  const base = '/uploads/';
  const path = base + name;
  return fs.readFile(path);
}

// No validation!`,
              rightCode: `function getFile(name) {
  const base = '/uploads/';
  const path = base + name;
  
  // Verify path stays in bounds
  if (!path.startsWith(base)) {
    throw new Error('Invalid');
  }
  return fs.readFile(path);
}`
            }
          }
        ]
      }
    ]
  },

  'metadata-heist': {
    id: 'metadata-heist',
    title: 'Digital Forensics: Metadata & Encoding',
    sections: [
      {
        title: 'What is Metadata?',
        content: `Metadata is "data about data." Every file contains hidden information beyond its visible content:

**Image metadata (EXIF) can include:**
• Camera make/model
• Date and time taken
• GPS coordinates
• Software used to edit
• Author information
• Comments and notes

This data persists even when images are copied or resized!`,
        visualComponents: [
          {
            type: 'HighlightBox',
            props: {
              variant: 'warning',
              title: 'Privacy Risk',
              content: 'Photos from smartphones often contain GPS coordinates. Sharing a home photo could reveal your address! Always strip metadata before sharing sensitive images.'
            }
          },
          {
            type: 'CodeBlock',
            props: {
              title: 'Common Metadata Fields',
              code: `EXIF Data Example:
═══════════════════════════════
Camera:      iPhone 14 Pro
Date:        2024-03-15 14:32
GPS:         40.7128° N, 74.0060° W
Software:    Adobe Photoshop
Author:      admin@company.com
Comment:     Internal use - access via /admin`
            }
          }
        ]
      },
      {
        title: 'Metadata in Security',
        content: `Attackers and defenders both use metadata:

**Attackers use metadata to:**
• Find hidden comments with credentials
• Discover internal paths or URLs
• Identify software versions for exploits
• Geolocate targets

**Defenders should:**
• Strip metadata from public files
• Review documents before sharing
• Use metadata as forensic evidence`,
        visualComponents: [
          {
            type: 'FlowDiagram',
            props: {
              title: 'Metadata Forensics',
              steps: [
                { label: 'Extract', description: 'Pull metadata from files' },
                { label: 'Analyze', description: 'Look for sensitive info' },
                { label: 'Correlate', description: 'Connect clues together' },
                { label: 'Exploit', description: 'Use findings to progress' }
              ]
            }
          }
        ]
      },
      {
        title: 'Cookie Manipulation',
        content: `Cookies store client-side data that servers use for session management and preferences. If apps trust cookie values without validation, attackers can manipulate them.`,
        visualComponents: [
          {
            type: 'ComparisonCards',
            props: {
              leftTitle: 'Original Cookies',
              rightTitle: 'Modified Cookies',
              leftCode: `access_level: "guest"
verified: "false"
session_id: "abc123"

→ Normal user access`,
              rightCode: `access_level: "admin"
verified: "true"
session_id: "abc123"

→ Admin access granted!`
            }
          },
          {
            type: 'HighlightBox',
            props: {
              variant: 'danger',
              title: 'The Vulnerability',
              content: 'The server trusts the cookie values without verifying them against server-side session data. Always validate permissions server-side!'
            }
          }
        ]
      },
      {
        title: 'Encoding Chains',
        content: `Real secrets are often protected by multiple encoding layers. Common encodings:

**Base64:** Binary to ASCII text
• atob() decodes, btoa() encodes
• Look for strings ending in = or ==

**ROT13:** Letter rotation cipher
• Each letter shifted 13 positions
• A→N, B→O, etc.
• Applying twice returns original`,
        visualComponents: [
          {
            type: 'CodeBlock',
            props: {
              title: 'Decoding Chain Example',
              code: `// Start: bTN0NGQ0dDRfaDBsZHM=
// This is Base64

// Step 1: Decode Base64
atob("bTN0NGQ0dDRfaDBsZHM=")
// Result: "m3t4d4t4_h0lds"

// Step 2: Apply ROT13
rot13("m3t4d4t4_h0lds")
// Result: "z3g4q4g4_u0yqf"

// Final key found!`
            }
          },
          {
            type: 'KeyTakeaways',
            props: {
              title: 'Forensics Tips',
              points: [
                'Always check file metadata - comments often contain secrets',
                'Look for encoded strings (Base64 often ends with =)',
                'Try common transformations: Base64, ROT13, hex',
                'Cookie values can be modified via DevTools',
                'Chain multiple techniques together',
                'Document your findings as you go'
              ]
            }
          }
        ]
      }
    ]
  }
}

export function getTutorialById(id) {
  return tutorials[id] || null
}
