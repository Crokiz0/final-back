import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictator } from '../dictators/entities/dictator.entity';
import { JwtStrategy } from '../dictators/jwt.strategy';
import { AutenticadorGuard } from './auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dictator]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AutenticadorGuard],
  exports: [JwtModule], // Cambia esto - solo exporta JwtModule
})
export class AuthModule {}