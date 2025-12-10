// Simple authentication configuration
// In production, use NextAuth.js with proper providers and database

// IMPORTANT: These are DEMO credentials for development only
// In production:
// 1. Use environment variables for credentials
// 2. Use proper password hashing (bcrypt, argon2)
// 3. Implement NextAuth.js with database sessions
// 4. Add rate limiting for login attempts
// 5. Use constant-time comparison for credentials

export const AUTH_CONFIG = {
  // Demo credentials - DO NOT use in production
  users: [
    {
      id: '1',
      email: process.env.ADMIN_EMAIL || 'admin@nerdcave.com',
      password: process.env.ADMIN_PASSWORD || 'admin123', // Use hashed passwords in production
      name: 'Admin User',
      role: 'admin' as const,
    },
  ],
};

export function validateCredentials(email: string, password: string) {
  // NOTE: This is a simplified demo implementation
  // Production must use:
  // - Hashed password comparison (bcrypt.compare)
  // - Constant-time comparison to prevent timing attacks
  // - Rate limiting to prevent brute force
  const user = AUTH_CONFIG.users.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}
