import bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

