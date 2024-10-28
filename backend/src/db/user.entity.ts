import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegramId: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  languageCode: string;

  @Column({ default: 0 })
  pointsBalance: number;

  @Column({ nullable: true })
  referrer: string;

  @Column({ default: 0 })
  friendsCount: number;

  @Column({ default: 0 })
  lastRequestAt: number;

  @Column({ default: 3 })
  liquidityPools: number;

  @Column({ nullable: true })
  liquidityPoolsUpdateDate: string;

  @Column({ default: 100 })
  liquidity: number;

  @Column({ type: 'simple-json', default: [] })
  datesOfvisits: string[];
}
