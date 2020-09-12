import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientEscort } from './entities/client-escort.entity';
import { DeviceInfo } from './entities/device-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceInfo, ClientEscort, Client])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
