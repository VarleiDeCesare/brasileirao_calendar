import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  shortName: string;

  @Column({ length: 500, nullable: true })
  crest: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 500, nullable: true })
  website: string;

  @Column({ type: 'int', nullable: true })
  founded: number;

  @Column({ length: 255, nullable: true })
  venue: string;

  @Column({ length: 255, nullable: true })
  coachName: string;
}
