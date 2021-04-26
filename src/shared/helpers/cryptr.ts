import * as CryptrLib from 'cryptr';

export class Cryptr {
  private static cryptrInstance(key: string): any {
    return new CryptrLib(key);
  }

  static encode(value: string, key: string): string {
    const cryptr = Cryptr.cryptrInstance(key);
    return cryptr.encrypt(value);
  }

  static decode(encodedValue: string, key: string): string {
    const cryptr = Cryptr.cryptrInstance(key);
    return cryptr.decrypt(encodedValue);
  }
}
