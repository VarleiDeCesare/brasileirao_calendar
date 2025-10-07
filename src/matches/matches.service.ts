import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Match } from './entities/match.entity';
import { FindAllFiltersDto } from './dto/find-all-filters.dto';

@Injectable()
export class MatchesService {
  constructor(
    @Inject('MATCH_REPOSITORY')
    private repo: Repository<Match>,
  ) {}

  async findAll(filters: FindAllFiltersDto) {
    const options: FindManyOptions<Match> = {};
    options.where = this.buildFindOptionsFromFilter(filters)?.where;

    options.select = {
      awayTeamId: true,
      awayTeamShortName: true,
      competitionName: true,
      homeTeamId: true,
      homeTeamShortName: true,
      id: true,
      utcDate: true,
    };

    const [matches, total] = await this.repo.findAndCount(options);

    return {
      data: matches,
      total: Number(total),
      page: Number(filters?.page ?? 1),
      limit: Number(filters?.limit ?? 100),
    };
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.repo.findOne({
      where: {
        id: id,
      },
    });

    if (!match) {
      throw new HttpException('Partida não encontrada.', HttpStatus.NOT_FOUND);
    }

    return match;
  }

  buildFindOptionsFromFilter(
    filters: FindAllFiltersDto,
  ): FindManyOptions<Match> {
    const options: FindManyOptions<Match> = {};
    const where: FindOptionsWhere<Match> = {};

    if (filters.todayGames) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      where.utcDate = Between(startOfDay, endOfDay);
      options.where = where;
      return options;
    }

    if (filters.id !== undefined) {
      where.id = filters.id;
    }

    if (filters.dateFrom !== undefined || filters.dateTo !== undefined) {
      const dateFrom = new Date(
        filters.dateFrom
          ? filters.dateFrom + 'T00:00:00.000Z'
          : new Date().toISOString(),
      );
      const dateTo = new Date(
        filters.dateTo
          ? filters.dateTo + 'T23:59:59.999Z'
          : new Date().toISOString(),
      );
      if (filters.dateFrom !== undefined && filters.dateTo !== undefined) {
        where.utcDate = Between(dateFrom, dateTo);
      } else if (filters.dateFrom !== undefined) {
        where.utcDate = MoreThanOrEqual(dateFrom);
      } else if (filters.dateTo !== undefined) {
        where.utcDate = LessThanOrEqual(dateTo);
      }
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;

    if (page > 1) {
      options.skip = (page - 1) * limit;
    }

    options.take = limit;
    options.where = where;

    options.order = {
      utcDate: 'ASC',
    };

    return options;
  }
}
