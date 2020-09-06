import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routeRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!routeRoles) return true;

    const request = context.switchToHttp().getRequest();

    const userRoles = request.user.roles;

    const userHasRoles = !!routeRoles.filter(item => userRoles.includes(item))
      .length;

    if (!userHasRoles) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
