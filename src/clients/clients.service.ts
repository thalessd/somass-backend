import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { EnterClientDto } from './dto/enter-client.dto';
import { PublicClient } from './models/PublicClient';
import { DeviceInfo } from './entities/device-info.entity';
import { SetClientDto } from './dto/set-client.dto';
import { v4 as uuid } from 'uuid';
import { ClientEscort } from './entities/client-escort.entity';
import { AppUtil } from '../shared/helpers/app-util';
import {
  EventDateHasPassedException,
  NoVacancyException,
} from '../shared/helpers/custom-exception';
import { Vacancy } from '../vacancies/vacancy.entity';
import { format } from 'date-fns';
import { EventsService } from '../event/events.service';
import { SubscribeClientDto } from './dto/subscribe-client.dto';
import { VacanciesService } from '../vacancies/vacancies.service';
import { UnsubscribeClientDto } from './dto/unsubscribe-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientEscort)
    private readonly clientEscortRepository: Repository<ClientEscort>,
    private eventsService: EventsService,
    private vacanciesService: VacanciesService,
  ) {}

  async enter(enterClientDto: EnterClientDto): Promise<PublicClient> {
    let client = await this.clientRepository.findOne({
      where: {
        cpf: enterClientDto.cpf,
      },
    });

    if (!client) {
      const deviceInfo = new DeviceInfo();

      deviceInfo.brand = '';
      deviceInfo.display = '';
      deviceInfo.model = '';
      deviceInfo.os = '';
      deviceInfo.physicalDevice = '';

      client = new Client();
      client.cpf = enterClientDto.cpf;
      client.deviceInfo = deviceInfo;
      client.token = '';

      client = await this.clientRepository.save(client);
    }

    client.token = uuid();

    await this.clientRepository.save(client);

    const publicClient = new PublicClient();

    publicClient.token = client.token;
    publicClient.fullName = client.fullName;
    publicClient.escorts = [];

    if (client.escorts) {
      client.escorts.forEach((escort) => {
        publicClient.escorts.push(escort.fullName);
      });
    }

    return publicClient;
  }

  async set(token: string, setClientDto: SetClientDto): Promise<void> {
    const clientFound = await this.clientRepository.findOneOrFail({
      where: { token },
    });

    clientFound.fullName = setClientDto.fullName ?? clientFound.fullName;

    clientFound.deviceInfo.os =
      setClientDto.deviceInfoOs ?? clientFound.deviceInfo.os;

    clientFound.deviceInfo.physicalDevice =
      setClientDto.deviceInfoPhysicalDevice ??
      clientFound.deviceInfo.physicalDevice;

    clientFound.deviceInfo.model =
      setClientDto.deviceInfoModel ?? clientFound.deviceInfo.model;

    clientFound.deviceInfo.brand =
      setClientDto.deviceInfoBrand ?? clientFound.deviceInfo.brand;

    clientFound.deviceInfo.display =
      setClientDto.deviceInfoDisplay ?? clientFound.deviceInfo.display;

    if (setClientDto.escorts) {
      await this.clientEscortRepository.remove(clientFound.escorts);

      clientFound.escorts = setClientDto.escorts.map<ClientEscort>(
        (publicEscort: string): ClientEscort => {
          const clientEscort = new ClientEscort();

          clientEscort.fullName = publicEscort;

          return clientEscort;
        },
      );
    }

    await this.clientRepository.save(clientFound);
  }

  async findOneByToken(token: string): Promise<Client> {
    return this.clientRepository.findOneOrFail({ where: { token } });
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async subscribe(
    token: string,
    subscribeClientDto: SubscribeClientDto,
  ): Promise<void> {
    const clientFound = await this.findOneByToken(token);
    const eventFound = await this.eventsService.findOne(
      subscribeClientDto.eventId,
    );

    const ocupiedSlots = await this.vacanciesService.getVacancyCount(
      eventFound,
    );

    const currentClientAndScortsQty = AppUtil.countClientPeoples(clientFound);

    if (ocupiedSlots + currentClientAndScortsQty > eventFound.vacancy) {
      throw new NoVacancyException();
    }

    const { dayOfWeek, startTime } = eventFound;

    const vacancyDate = AppUtil.getFullDateTimeFromOneWeekDay(dayOfWeek);

    if (!AppUtil.testEventDateTimeIsAfterDateTime(startTime, dayOfWeek)) {
      throw new EventDateHasPassedException();
    }

    const vacancy = new Vacancy();

    vacancy.client = clientFound;
    vacancy.event = eventFound;
    vacancy.dateWasSet = format(vacancyDate, 'yyyy-MM-dd');

    await this.vacanciesService.saveEntity(vacancy);
  }

  async unsubscribe(
    token: string,
    unsubscribeClientDto: UnsubscribeClientDto,
  ): Promise<void> {
    const clientFound = await this.findOneByToken(token);
    const eventFound = await this.eventsService.findOne(
      unsubscribeClientDto.eventId,
    );

    const lessDateOfWeek = AppUtil.mondayOfWeekStr();

    const { dayOfWeek, startTime } = eventFound;

    if (!AppUtil.testEventDateTimeIsAfterDateTime(startTime, dayOfWeek)) {
      throw new EventDateHasPassedException();
    }

    await this.vacanciesService.deleteEntity({
      event: eventFound,
      dateWasSet: MoreThanOrEqual(lessDateOfWeek),
      client: clientFound,
    });
  }
}
