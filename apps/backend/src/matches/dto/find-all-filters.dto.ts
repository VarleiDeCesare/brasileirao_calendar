import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class FindAllFiltersDto {
  @IsOptional()
  @IsInt()
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsBoolean()
  todayGames?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateFrom must be in yyyy-mm-dd format',
  })
  @IsOptional()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateTo must be in yyyy-mm-dd format',
  })
  @IsOptional()
  dateTo?: string;

  @IsOptional()
  @IsInt()
  @IsOptional()
  limit?: number = 100;

  @IsOptional()
  @IsInt()
  @IsOptional()
  page?: number = 1;
}
