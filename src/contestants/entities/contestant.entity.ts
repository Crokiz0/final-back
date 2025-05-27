import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Dictator } from 'src/dictators/entities/dictator.entity';
export enum ContestantStatus {
    ALIVE = 'Alive',
    DEAD = 'Dead',
    ESCAPED = 'Escaped',
    FREE = 'Free'
}

@Entity()
export class Contestant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        nullable: false
    })
    name: string;

    @Column('varchar', {
        nullable: false
    })
    nickname: string;

    @Column('varchar', {
        nullable: false
    })
    origin: string;

    @ManyToOne(() => Dictator, (dictator) => dictator.contestants)
    dictator: Dictator;

    @Column('int', {
        default: 50
    })
    strength: number;

    @Column('int', {
        default: 50
    })
    agility: number;

    @Column('int', {
        default: 0
    })
    wins: number;

    @Column('int', {
        default: 0
    })
    losses: number;

    @Column({
        type: 'enum',
        enum: ContestantStatus,
        default: ContestantStatus.ALIVE
    })
    status: ContestantStatus;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
}