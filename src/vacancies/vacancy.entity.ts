import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @OneToOne((type) => Client, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  client: Client;

  @ManyToOne((type) => Event, { eager: true, nullable: false })
  event: Event;

  @Column({ type: 'date', nullable: false })
  dateWasSet: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
