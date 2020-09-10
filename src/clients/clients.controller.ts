import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { EnterClientDto } from './dto/enter-client.dto';
import { ClientsService } from './clients.service';
import { PublicClient } from './models/PublicClient';
import { SetClientDto } from './dto/set-client.dto';

@Controller('client')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('enter')
  async enter(@Body() enterClientDto: EnterClientDto): Promise<PublicClient> {
    return this.clientsService.enter(enterClientDto);
  }

  @Put('set/:token')
  async set(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() setClientDto: SetClientDto,
  ): Promise<void> {
    return this.clientsService.set(token, setClientDto);
  }
}
