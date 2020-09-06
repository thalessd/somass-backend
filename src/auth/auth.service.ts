import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { JwtBlacklist } from './jwt-blacklist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cryptr } from '../shared/helpers/cryptr';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(JwtBlacklist)
    private readonly jwtBlacklistRepository: Repository<JwtBlacklist>,
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private makeJwtPayload(user: Partial<User>): any {
    const key = this.configService.get<string>('SERVER_SECRET');
    const cryptedRoles = Cryptr.encode(JSON.stringify(user.roles), key);

    return { name: user.name, email: user.email, cryptedRoles, sub: user.id };
  }

  private static getJwtToken(request: any): string {
    const extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
    return extractJwt(request);
  }

  async validate(email: string, password: string): Promise<Partial<User>> {
    return this.userService.loginVerify(email, password);
  }

  async hasInBlacklist(request: any): Promise<boolean> {
    const jwtToken = AuthService.getJwtToken(request);

    return !!(await this.jwtBlacklistRepository.findOne({
      where: { token: jwtToken },
    }));
  }

  login(user: Partial<User>): any {
    const payload = this.makeJwtPayload(user);

    return { token: this.jwtService.sign(payload) };
  }

  async refresh(request: any): Promise<any> {
    const user: Partial<User> = request.user;
    const jwtToken = AuthService.getJwtToken(request);

    await this.jwtBlacklistRepository.save({ token: jwtToken });

    const payload = this.makeJwtPayload(user);

    return { token: this.jwtService.sign(payload) };
  }

  async logout(request: any): Promise<void> {
    const jwtToken = AuthService.getJwtToken(request);

    await this.jwtBlacklistRepository.save({ token: jwtToken });

    return;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async clearJwtTokenBlacklist(): Promise<void> {
    const blacklist = await this.jwtBlacklistRepository.find();

    const expiredTokens: JwtBlacklist[] = [];

    blacklist.forEach(item => {
      try {
        this.jwtService.verify(item.token);
      } catch (e) {
        expiredTokens.push(item);
      }
    });

    if (expiredTokens.length === 0) return;

    await this.jwtBlacklistRepository.remove(expiredTokens);

    console.log('The blacklist has been cleared!');
  }
}
