import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rewards')
export class RewardsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  rewardId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  condition: string;

  @Column({ type: 'int', default: 0, nullable: true })
  points?: number;

  @Column({ type: 'int', nullable: true })
  lootboxPoints?: number;

  @Column({ type: 'int', nullable: true })
  liquidityPools?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  boost?: string;
}
