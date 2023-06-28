import { IUser } from '../interfaces/interfaces';

export function validateUserFields(user: IUser): string | null {
  if (!user.username || !user.age || !user.hobbies) {
    return 'Username/Age/Hobbies is required';
  }

  return null;
}

export function validateUserId(userId: string): boolean {
  const uuidRegex = /^[a-fA-F0-9-]{36}$/;
  return uuidRegex.test(userId);
}
