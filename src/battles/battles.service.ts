import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/battle.entity';
import { CreateBattleDto } from './dto/create-battle.dto';
import { ContestantsService } from '../contestants/contestants.service';
import { ContestantStatus } from '../contestants/entities/contestant.entity';

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private readonly battleRepository: Repository<Battle>,
    private readonly contestantsService: ContestantsService,
  ) {}

  async create(createBattleDto: CreateBattleDto): Promise<Battle> {
    await this.validateContestantsExist(
      createBattleDto.contestant_1_id,
      createBattleDto.contestant_2_id
    );

    const [c1, c2] = await Promise.all([
      this.contestantsService.findOne(createBattleDto.contestant_1_id),
      this.contestantsService.findOne(createBattleDto.contestant_2_id),
    ]);

    const power1 = c1.strength + c1.agility;
    const power2 = c2.strength + c2.agility;
    const totalPower = power1 + power2;

    const random = Math.random() * totalPower;
    const winner = random < power1 ? c1 : c2;
    const loser = winner.id === c1.id ? c2 : c1;

    const deathOccurred = Math.random() < 0.5;
    const winnerInjured = Math.random() < 0.6;
    const loserInjured = !deathOccurred;

    const injuries = [
      winnerInjured ? `Ganador (${winner.name}) herido` : null,
      loserInjured ? `Perdedor (${loser.name}) herido` : null,
      deathOccurred ? `Perdedor (${loser.name}) muerto` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const battle = this.battleRepository.create({
      ...createBattleDto,
      winner_id: winner.id,
      death_occurred: deathOccurred,
      injuries,
    });

    await this.contestantsService.incrementWins(winner.id);

    if (deathOccurred) {
      await this.contestantsService.update(loser.id, {
        status: ContestantStatus.DEAD,
      });
    } else {
      await this.contestantsService.incrementLosses(loser.id);
    }

    return this.battleRepository.save(battle);
  }

  async findAll(): Promise<Battle[]> {
    return this.battleRepository.find({ order: { date: 'DESC' } });
  }

  async findOne(id: string): Promise<Battle> {
    const battle = await this.battleRepository.findOneBy({ id });

    if (!battle) {
      throw new NotFoundException(`Battle with ID "${id}" not found`);
    }

    return battle;
  }

  async update(id: string, updateBattleDto: Partial<CreateBattleDto>): Promise<Battle> {
    const battle = await this.findOne(id);
    const updatedBattle = this.battleRepository.merge(battle, updateBattleDto);

    return this.battleRepository.save(updatedBattle);
  }

  async remove(id: string): Promise<void> {
    const result = await this.battleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Battle with ID "${id}" not found`);
    }
  }

  async endBattle(
    id: string,
    winnerId: string,
    deathOccurred: boolean,
    injuries?: string
  ): Promise<Battle> {
    const battle = await this.findOne(id);
    const loserId = this.getLoserId(battle, winnerId);

    this.updateBattleResult(battle, winnerId, deathOccurred, injuries);
    await this.updateContestantsRecords(winnerId, loserId, deathOccurred);

    return this.battleRepository.save(battle);
  }

  private async validateContestantsExist(...contestantIds: string[]): Promise<void> {
    await Promise.all(
      contestantIds.map(id => this.contestantsService.findOne(id))
    );
  }

  private getLoserId(battle: Battle, winnerId: string): string {
    return battle.contestant_1_id === winnerId 
      ? battle.contestant_2_id 
      : battle.contestant_1_id;
  }

  private updateBattleResult(
    battle: Battle,
    winnerId: string,
    deathOccurred: boolean,
    injuries?: string
  ): void {
    battle.winner_id = winnerId;
    battle.death_occurred = deathOccurred;
    battle.injuries = injuries || null;
  }

  private async updateContestantsRecords(
    winnerId: string,
    loserId: string,
    deathOccurred: boolean
  ): Promise<void> {
    await this.contestantsService.incrementWins(winnerId);

    if (deathOccurred) {
      await this.contestantsService.update(loserId, { 
        status: ContestantStatus.DEAD 
      });
    } else {
      await this.contestantsService.incrementLosses(loserId);
    }
  }
}
