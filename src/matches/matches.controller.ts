import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { FindAllFiltersDto } from './dto/find-all-filters.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async findAll(@Query() filters: FindAllFiltersDto) {
    return this.matchesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }
}
