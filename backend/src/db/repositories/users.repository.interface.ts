import { BaseInterfaceRepository } from './base/base.interface.repository';

import { UserEntity } from '../user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
