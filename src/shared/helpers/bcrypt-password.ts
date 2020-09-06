import * as bcrypt from 'bcrypt';

export class BcryptPassword {
  static encode(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static verify(password: string, encodedPassword: string): boolean {
    return bcrypt.compareSync(password, encodedPassword);
  }
}
