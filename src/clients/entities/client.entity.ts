import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientEscort } from './client-escort.entity';
import { DeviceInfo } from './device-info.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, default: '' })
  fullName: string;

  @Column({ nullable: false, unique: true })
  cpf: string;

  @OneToOne((type) => DeviceInfo, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  deviceInfo: DeviceInfo;

  @ManyToMany((type) => ClientEscort, { eager: true, cascade: true })
  @JoinTable()
  escorts: ClientEscort[];

  @Column({ nullable: false })
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
