import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { CreateSponsorDto } from './dto/create-sponsor.dto';

@Injectable()
export class SponsorsService {
  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository: Repository<Sponsor>,
  ) {}

  async create(createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
    const sponsor = this.sponsorRepository.create(createSponsorDto);
    return this.sponsorRepository.save(sponsor);
  }

  async findAll(): Promise<Sponsor[]> {
    return this.sponsorRepository.find({ 
      order: { created_at: 'DESC' } 
    });
  }

  async findOne(id: string): Promise<Sponsor> {
    const sponsor = await this.sponsorRepository.findOneBy({ id });
    
    if (!sponsor) {
      throw new NotFoundException(`Sponsor with ID "${id}" not found`);
    }
    
    return sponsor;
  }

  async update(
    id: string, 
    updateSponsorDto: Partial<CreateSponsorDto>
  ): Promise<Sponsor> {
    const sponsor = await this.findOne(id);
    const updatedSponsor = this.sponsorRepository.merge(sponsor, updateSponsorDto);
    
    return this.sponsorRepository.save(updatedSponsor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.sponsorRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Sponsor with ID "${id}" not found`);
    }
  }

  async findByFighter(fighterId: string): Promise<Sponsor[]> {
    return this.sponsorRepository.find({ 
      where: { preferred_fighter: fighterId } 
    });
  }
}