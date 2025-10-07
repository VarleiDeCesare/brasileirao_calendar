import { DataSource } from 'typeorm';
import { Team } from '../entities/team.entity';

export const teamsProvider = {
  provide: 'TEAMS_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Team),
  inject: ['DATA_SOURCE'],
};
