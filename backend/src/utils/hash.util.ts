import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string, saltRounds: number): Promise<string> {
  if(isNaN(saltRounds) || password === undefined) {
    throw new Error('SALT environment variable or password is not defined');
  }
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  if(password === undefined || hashedPassword === undefined) {
    throw new Error('Password or hashed password is not defined');
  }
  return bcrypt.compare(password, hashedPassword);
}