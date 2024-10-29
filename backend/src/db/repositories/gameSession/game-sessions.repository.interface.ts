import { BaseInterfaceRepository } from '../base/base.interface.repository';

import { GameSessionEntity } from '../../game-session.entry';

export interface GameSessionRepositoryInterface
  extends BaseInterfaceRepository<GameSessionEntity> {}
