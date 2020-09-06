import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JwtBlacklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;
}
