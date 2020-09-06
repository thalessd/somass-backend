import { createHash } from 'crypto';

export class Md5 {
  static encode(string: string): string {
    return createHash('md5')
      .update(string)
      .digest('hex');
  }
}
