import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';
import { LoginDTO } from './dto/login.dto';
import { Dictator } from './entities/dictator.entity';
import { Contestant } from '../contestants/entities/contestant.entity';

interface TokenPayload {
  name: string;
}

@Injectable()
export class DictatorsService {
  findContestantsByDictator(dictatorId: string): Contestant {
    throw new Error('Method not implemented.');
  }
  private readonly saltLength = 16;
  private readonly keyLength = 64;
  private readonly scryptParams = { N: 16384, r: 8, p: 1 };

  constructor(
    @InjectRepository(Dictator)
    private dictatorRepository: Repository<Dictator>,
    @InjectRepository(Contestant)
    private contestantRepository: Repository<Contestant>,
    private jwtService: JwtService
  ) {}

  async create(createDictatorDto: CreateDictatorDto): Promise<Dictator> {
    const hashedPassword = this.hashPassword(createDictatorDto.password);
    const dictator = this.dictatorRepository.create({
      ...createDictatorDto,
      password: hashedPassword
    });
    return this.dictatorRepository.save(dictator);
  }

  async login(loginDTO: LoginDTO): Promise<{ dictator: Dictator; token: string }> {
    const dictator = await this.dictatorRepository.findOneBy({ name: loginDTO.name });
    if (!dictator) throw new NotFoundException('User not found');
    
    const isValid = this.verifyPassword(loginDTO.password, dictator.password);
    if (!isValid) throw new NotFoundException('Invalid credentials');

    const token = this.jwtService.sign({ name: dictator.name });
    return { dictator, token };
  }

  findAll(): Promise<Dictator[]> {
    return this.dictatorRepository.find({ relations: ['contestants'] });
  }

  findOne(id: string): Promise<Dictator | null> {
    return this.dictatorRepository.findOne({
      where: { id },
      relations: ['contestants']
    });
  }

  async update(id: string, updateDictatorDto: UpdateDictatorDto): Promise<Dictator> {
    const hashedPassword = updateDictatorDto.password 
      ? this.hashPassword(updateDictatorDto.password) 
      : undefined;
    await this.dictatorRepository.update(id, {
      ...updateDictatorDto,
      password: hashedPassword
    });
    await this.updateContestantCount(id);
    return this.findOne(id) as Promise<Dictator>;
  }

  async remove(id: string): Promise<void> {
    await this.dictatorRepository.delete(id);
  }

  async findContestants(dictatorId: string): Promise<Contestant[]> {
    return this.contestantRepository.find({
      where: { dictator: { id: dictatorId } }
    });
  }

  private async updateContestantCount(id: string): Promise<void> {
    const dictator = await this.findOne(id);
    if (!dictator) return;
    
    dictator.number_of_slaves = dictator.contestants.length;
    await this.dictatorRepository.save(dictator);
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(this.saltLength).toString('hex');
    const hash = scryptSync(password, salt, this.keyLength, this.scryptParams).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, key] = storedHash.split(':');
    const derivedKey = scryptSync(password, salt, this.keyLength, this.scryptParams);
    try {
      return timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
    } catch {
      return false;
    }
  }
}