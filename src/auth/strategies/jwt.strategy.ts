import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';
import { Cryptr } from '../../shared/helpers/cryptr';
import { Role } from '../../users/enum/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any): Promise<User> {
    const hasInBlackList = await this.authService.hasInBlacklist(request);

    if (hasInBlackList) {
      throw new UnauthorizedException();
    }

    const roles: Role[] = JSON.parse(
      Cryptr.decode(
        payload.cryptedRoles,
        this.configService.get<string>('SERVER_SECRET'),
      ),
    );

    const user = new User();

    user.id = payload.sub;
    user.name = payload.name;
    user.email = payload.email;
    user.roles = roles;
    user.password = null;
    user.createdAt = null;
    user.updatedAt = null;

    return user;
  }
}
