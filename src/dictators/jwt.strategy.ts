import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Dictator } from './entities/dictator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/interface/JwtPayload';
import { ConfigService } from '@nestjs/config'; // Añade esta importación

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository: Repository<Dictator>,
    private readonly configService: ConfigService // Inyecta ConfigService
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret, // Usa ConfigService
    });
  }

  async validate(payload: JwtPayload) {
    const { name } = payload;
    const dictator = await this.dictatorRepository.findOneBy({ name });
    if (!dictator) {
      throw new UnauthorizedException('User not found');
    }
    return dictator;
  }
}