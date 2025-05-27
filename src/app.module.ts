import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContestantsModule } from './contestants/contestants.module';
import { BattlesModule } from './battles/battles.module';
import { DictatorsModule } from './dictators/dictators.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { Contestant } from './contestants/entities/contestant.entity';
import { Battle } from './battles/entities/battle.entity';
import { Dictator } from './dictators/entities/dictator.entity';
import { Sponsor } from './sponsors/entities/sponsor.entity';
import { Transaction } from './transactions/entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ Solo en desarrollo, usa migraciones en producción
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    ContestantsModule,
    BattlesModule,
    DictatorsModule,
    SponsorsModule,
    TransactionsModule,
    AuthModule,
  ],
})
export class AppModule {}
