// Fake user data for IDOR challenge
// All data is completely fictional and for educational purposes only

export const fakeUsers = {
  0: {
    id: 0,
    name: '[ADMIN]',
    role: 'System Administrator',
    email: 'admin@hackmelab.fake',
    department: 'Security Operations',
    joinDate: '2020-01-01',
    isAdmin: true,
    secret: true,
    bio: 'Root access to all systems. This profile should NOT be accessible to regular users!',
  },
  1: {
    id: 1,
    name: 'Alice Johnson',
    role: 'Frontend Developer',
    email: 'alice.johnson@hackmelab.fake',
    department: 'Engineering',
    joinDate: '2023-03-15',
    isAdmin: false,
    bio: 'Passionate about creating beautiful user interfaces and accessible web applications.',
  },
  2: {
    id: 2,
    name: 'Bob Smith',
    role: 'Backend Developer',
    email: 'bob.smith@hackmelab.fake',
    department: 'Engineering',
    joinDate: '2022-08-20',
    isAdmin: false,
    bio: 'Database enthusiast and API architect. Loves clean code and strong coffee.',
  },
  3: {
    id: 3,
    name: 'Charlie Brown',
    role: 'UX Designer',
    email: 'charlie.brown@hackmelab.fake',
    department: 'Design',
    joinDate: '2023-01-10',
    isAdmin: false,
    bio: 'Creating intuitive experiences that delight users. Design is not just what it looks like.',
  },
  4: {
    id: 4,
    name: 'Diana Martinez',
    role: 'QA Engineer',
    email: 'diana.martinez@hackmelab.fake',
    department: 'Quality Assurance',
    joinDate: '2022-11-05',
    isAdmin: false,
    bio: 'Finding bugs before users do. If there\'s a way to break it, I\'ll find it!',
  },
  5: {
    id: 5,
    name: 'Ethan Williams',
    role: 'DevOps Engineer',
    email: 'ethan.williams@hackmelab.fake',
    department: 'Infrastructure',
    joinDate: '2021-06-30',
    isAdmin: false,
    bio: 'Automating everything. If I have to do it twice, I\'ll write a script.',
  },
  999: {
    id: 999,
    name: '[SUPERADMIN]',
    role: 'Root Administrator',
    email: 'superadmin@hackmelab.fake',
    department: 'Executive Security',
    joinDate: '2019-01-01',
    isAdmin: true,
    secret: true,
    bio: 'Ultimate system access. This is the hidden superadmin account!',
  },
}

export function getUserById(id) {
  return fakeUsers[id] || null
}

export function getRegularUsers() {
  return Object.values(fakeUsers).filter(user => !user.secret)
}

export function isAdminUser(id) {
  const user = fakeUsers[id]
  return user?.isAdmin || false
}
