// Sample file for testing Context Lens

export async function loginUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const user = await findUserByEmail(email);
  
  if (user && user.password === hashedPassword) {
    return generateAuthToken(user.id);
  }
  
  throw new Error("Invalid credentials");
}

function hashPassword(password: string): Promise<string> {
  // Simple hash simulation
  return Promise.resolve(
    Buffer.from(password).toString('base64')
  );
}

async function findUserByEmail(email: string) {
  // Simulated database lookup
  const users = [
    { id: 1, email: "user@example.com", password: "hashedpass123" }
  ];
  return users.find(u => u.email === email);
}

const generateAuthToken = (userId: number) => {
  return `token_${userId}_${Date.now()}`;
};

export class UserService {
  async createUser(email: string, name: string) {
    // Validate email format
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    // Create user in database
    return {
      id: Math.random(),
      email,
      name,
      createdAt: new Date()
    };
  }
  
  deleteUser(userId: number) {
    console.log(`Deleting user ${userId}`);
    return true;
  }
}