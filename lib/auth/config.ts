// Simple authentication configuration
// In production, use NextAuth.js with proper providers and database

export const AUTH_CONFIG = {
  // Demo credentials - DO NOT use in production
  users: [
    {
      id: '1',
      email: 'admin@nerdcave.com',
      password: 'admin123', // In production, this should be hashed
      name: 'Admin User',
      role: 'admin' as const,
    },
  ],
};

export function validateCredentials(email: string, password: string) {
  const user = AUTH_CONFIG.users.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}
