import { AppDataSource } from '@/database/data-source';
import { User } from '@/entities/user.entity';

export const userRepository = AppDataSource.getRepository(User);

export async function findUserById(id: string): Promise<User | null> {
  return userRepository.findOne({ where: { id } });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return userRepository.findOne({ where: { email } });
}

export async function findUserWithRoles(id: string): Promise<User | null> {
  return userRepository.findOne({
    where: { id },
    relations: { userRoles: { role: { permissions: { module: true } } } },
  });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string | null;
}): Promise<User> {
  const user = userRepository.create(data);
  return userRepository.save(user);
}

export async function saveUser(user: User): Promise<User> {
  return userRepository.save(user);
}
