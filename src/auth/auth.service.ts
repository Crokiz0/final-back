import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictator } from '../dictators/entities/dictator.entity';
import { JwtService } from '@nestjs/jwt';
import { scryptSync, timingSafeEqual } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository: Repository<Dictator>,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const dictator = await this.dictatorRepository.findOne({ where: { email } });
    if (!dictator || !this.verifyPassword(password, dictator.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: dictator.id,
      email: dictator.email,
      role: 'dictator',
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, role: 'dictator' };
  }

  private verifyPassword(plain: string, stored: string): boolean {
    const [salt, hash] = stored.split(':');
    const hashBuffer = Buffer.from(hash, 'hex');
    const testHash = scryptSync(plain, salt, hashBuffer.length);
    return timingSafeEqual(testHash, hashBuffer);
  }
}
