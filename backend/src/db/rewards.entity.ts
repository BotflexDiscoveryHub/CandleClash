import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BoostUserDto } from '../rewards/dto/reward-progress.dto';

@Entity('rewards')
export class RewardsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  rewardId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'int', nullable: true })
  condition?: number;

  @Column({ type: 'int', default: 0, nullable: true })
  points?: number;

  @Column({ type: 'int', nullable: true })
  lootboxPoints?: number;

  @Column({ type: 'int', nullable: true })
  liquidity?: number;

  @Column({ type: 'int', nullable: true })
  liquidityPools?: number;

  @Column({ type: 'json', nullable: true })
  boost?: BoostUserDto;
}
