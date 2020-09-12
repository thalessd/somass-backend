import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { UnsubscribeDto } from './dto/unsubscribe.dto';

@Controller('vacancy')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post('subscribe/:token')
  async subscribe(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() subscribeDto: SubscribeDto,
  ): Promise<void> {
    return this.vacanciesService.subscribe(token, subscribeDto);
  }

  @Post('unsubscribe/:token')
  async unsubscribe(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() unsubscribeDto: UnsubscribeDto,
  ): Promise<void> {
    return this.vacanciesService.unsubscribe(token, unsubscribeDto);
  }
}
