import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DayOfWeek } from './enum/day-of-week.enum';
import { User } from '../users/user.entity';

@Entity()
@Index(['location', 'startTime', 'dayOfWeek'], { unique: true })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  location: string;

  @Column({ type: 'time', nullable: false })
  startTime: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: false,
  })
  dayOfWeek: DayOfWeek;

  @Column({ nullable: false, default: 1 })
  vacancy: number;

  @Column({ nullable: false, default: true })
  available: boolean;

  @ManyToOne((type) => User, { eager: true, nullable: false })
  createdBy: User;

  @ManyToOne((type) => User, { eager: true, nullable: true })
  updatedBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
