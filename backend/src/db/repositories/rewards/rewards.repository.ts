import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '../base/base.abstract.repository';
import { RewardsRepositoryInterface } from './rewards.repository.interface';
import { RewardsEntity } from '../../rewards.entity';

@Injectable()
export class RewardsRepository
  extends BaseAbstractRepository<RewardsEntity>
  implements RewardsRepositoryInterface
{
  constructor(
    @InjectRepository(RewardsEntity)
    private readonly RewardsRepository: Repository<RewardsEntity>,
  ) {
    super(RewardsRepository);
  }
}
