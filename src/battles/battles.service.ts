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

    const battle = this.battleRepository.create(createBattleDto);
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