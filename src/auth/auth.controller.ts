import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  login(@Request() request: any) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  refresh(@Request() request: any) {
    return this.authService.refresh(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  logout(@Request() request: any) {
    return this.authService.logout(request);
  }
}
