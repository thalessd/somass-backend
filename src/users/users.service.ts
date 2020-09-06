import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { BcryptPassword } from '../shared/helpers/bcrypt-password';
import { Role } from './enum/role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  // ADMIN USER

  async createAdmin(createAdminUserDto: CreateAdminUserDto): Promise<User> {
    const user = new User();

    user.name = createAdminUserDto.name;
    user.email = createAdminUserDto.email;
    user.password = BcryptPassword.encode(createAdminUserDto.password);
    user.roles = [Role.Admin];

    return this.userRepository.save(user);
  }

  async updateAdmin(
    id: string,
    updateAdminUserDto: UpdateAdminUserDto,
  ): Promise<User> {
    const userFound = await this.userRepository.findOneOrFail(id);

    userFound.name = updateAdminUserDto.name ?? userFound.name;
    userFound.email = updateAdminUserDto.email ?? userFound.email;

    if (updateAdminUserDto.password) {
      userFound.password = BcryptPassword.encode(updateAdminUserDto.password);
    }

    const data = await this.userRepository.save(userFound);
    delete data.password;

    return data;
  }

  async createFirstUserAdmin(): Promise<void> {
    try {
      const usersCount = await this.userRepository.count();

      if (usersCount >= 1) return;

      const createAdminUserDto = new CreateAdminUserDto();

      createAdminUserDto.name = this.configService.get<string>(
        'SYSTEM_ADMIN_NAME',
      );
      createAdminUserDto.email = this.configService.get<string>(
        'SYSTEM_ADMIN_EMAIL',
      );
      createAdminUserDto.password = this.configService.get<string>(
        'SYSTEM_ADMIN_PASSWORD',
      );

      await this.createAdmin(createAdminUserDto);

      console.log('FIRST USER CREATED: ');
      console.log(`EMAIL: ${createAdminUserDto.email}`);
      console.log(`PASSWORD: ${createAdminUserDto.password}`);
    } catch (e) {
      console.error('FIRST USER WAS NOT CREATED!');
    }
  }

  // ADMIN USER

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async loginVerify(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roles', 'createdAt', 'updatedAt'],
    });

    if (!user) return null;

    const { password: encodedPassword, ...rest } = user;

    return BcryptPassword.verify(password, encodedPassword) ? rest : null;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async onApplicationBootstrap(): Promise<any> {
    return this.createFirstUserAdmin();
  }
}
