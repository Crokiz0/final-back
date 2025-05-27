import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contestant } from './entities/contestant.entity';
import { CreateContestantDto } from './dto/create-contestant.dto';

@Injectable()
export class ContestantsService {
  constructor(
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
  ) {}

  async create(createContestantDto: CreateContestantDto): Promise<Contestant> {
    const contestant = this.contestantRepository.create(createContestantDto);
    return this.saveContestant(contestant);
  }

  async findAll(): Promise<Contestant[]> {
    return this.contestantRepository.find({ 
      order: { created_at: 'DESC' } 
    });
  }

  async findOne(id: string): Promise<Contestant> {
    const contestant = await this.contestantRepository.findOneBy({ id });
    
    if (!contestant) {
      throw new NotFoundException(`Contestant with ID "${id}" not found`);
    }
    
    return contestant;
  }

  async update(
    id: string,
    updateContestantDto: Partial<CreateContestantDto>
  ): Promise<Contestant> {
    const contestant = await this.findOne(id);
    const updatedContestant = this.contestantRepository.merge(contestant, updateContestantDto);
    
    return this.saveContestant(updatedContestant);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contestantRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Contestant with ID "${id}" not found`);
    }
  }

  async incrementWins(id: string): Promise<Contestant> {
    return this.incrementField(id, 'wins');
  }

  async incrementLosses(id: string): Promise<Contestant> {
    return this.incrementField(id, 'losses');
  }

  private async incrementField(id: string, field: 'wins' | 'losses'): Promise<Contestant> {
    const contestant = await this.findOne(id);
    contestant[field] += 1;
    return this.saveContestant(contestant);
  }

  private async saveContestant(contestant: Contestant): Promise<Contestant> {
    return this.contestantRepository.save(contestant);
  }
}