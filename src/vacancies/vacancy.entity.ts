import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '../event/event.entity';
import { Client } from '../clients/entities/client.entity';

@Entity()
@Index(['client', 'event', 'dateWasSet'], { unique: true })
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Client, {
    eager: true,
    nullable: false,
  })
  client: Client;

  @ManyToOne((type) => Event, { eager: true, nullable: false })
  event: Event;

  @Column({ type: 'date', nullable: false })
  dateWasSet: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
