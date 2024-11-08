import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('game_session')
export class GameSessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ nullable: true })
  finalLiquidity: number;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;
}
