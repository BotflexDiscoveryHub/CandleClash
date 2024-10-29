import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '../base/base.abstract.repository';
import { GameSessionEntity } from '../../game-session.entry';
import { GameSessionRepositoryInterface } from './game-sessions.repository.interface';

@Injectable()
export class GameSessionRepository
  extends BaseAbstractRepository<GameSessionEntity>
  implements GameSessionRepositoryInterface
{
  constructor(
    @InjectRepository(GameSessionEntity)
    private readonly GameSessionRepository: Repository<GameSessionEntity>,
  ) {
    super(GameSessionRepository);
  }
}
