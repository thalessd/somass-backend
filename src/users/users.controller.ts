import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enum/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ADMIN USER

  @Post('admin')
  @Roles(Role.Admin)
  createAdmin(@Body() createAdminUserDto: CreateAdminUserDto): Promise<User> {
    return this.usersService.createAdmin(createAdminUserDto);
  }

  @Put('admin/:id')
  @Roles(Role.Admin)
  updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminUserDto: UpdateAdminUserDto,
  ): Promise<User> {
    return this.usersService.updateAdmin(id, updateAdminUserDto);
  }

  // ADMIN USER

  @Get('me')
  @Roles(Role.Admin)
  findMe(
    @Request() request: any,
  ): Promise<User> {
    const userId = request.user.id;

    return this.usersService.findOne(userId);
  }

  @Get()
  @Roles(Role.Admin)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
