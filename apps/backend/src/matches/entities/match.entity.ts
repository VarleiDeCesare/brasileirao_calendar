import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'timestamp' })
  utcDate: Date;

  @Column({ length: 50 })
  status: string;

  @Column({ type: 'int', nullable: true })
  matchday: number;

  @Column({ length: 50 })
  stage: string;

  @Column({ length: 50, nullable: true })
  group: string;

  @Column({ type: 'timestamp' })
  lastUpdated: Date;

  @Column({ type: 'int' })
  areaId: number;

  @Column({ length: 255 })
  areaName: string;

  @Column({ length: 10 })
  areaCode: string;

  @Column({ length: 500, nullable: true })
  areaFlag: string;

  @Column({ type: 'int' })
  competitionId: number;

  @Column({ length: 255 })
  competitionName: string;

  @Column({ length: 10 })
  competitionCode: string;

  @Column({ length: 50 })
  competitionType: string;

  @Column({ length: 500, nullable: true })
  competitionEmblem: string;

  @Column({ type: 'int' })
  seasonId: number;

  @Column({ type: 'date' })
  seasonStartDate: Date;

  @Column({ type: 'date' })
  seasonEndDate: Date;

  @Column({ type: 'int', nullable: true })
  seasonCurrentMatchday: number;

  @Column({ type: 'int', nullable: true })
  seasonWinner: number;

  @Column({ type: 'int' })
  homeTeamId: number;

  @Column({ length: 255 })
  homeTeamName: string;

  @Column({ length: 255 })
  homeTeamShortName: string;

  @Column({ length: 10 })
  homeTeamTla: string;

  @Column({ length: 500, nullable: true })
  homeTeamCrest: string;

  @Column({ type: 'int' })
  awayTeamId: number;

  @Column({ length: 255 })
  awayTeamName: string;

  @Column({ length: 255 })
  awayTeamShortName: string;

  @Column({ length: 10 })
  awayTeamTla: string;

  @Column({ length: 500, nullable: true })
  awayTeamCrest: string;

  @Column({ length: 50, nullable: true })
  scoreWinner: string;

  @Column({ length: 50 })
  scoreDuration: string;

  @Column({ type: 'int', nullable: true })
  scoreFullTimeHome: number;

  @Column({ type: 'int', nullable: true })
  scoreFullTimeAway: number;

  @Column({ type: 'int', nullable: true })
  scoreHalfTimeHome: number;

  @Column({ type: 'int', nullable: true })
  scoreHalfTimeAway: number;

  @Column({ type: 'text', nullable: true })
  oddsMsg: string;
}
