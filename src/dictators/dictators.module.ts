import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictatorsService } from './dictators.service';
import { DictatorsController } from './dictators.controller';
import { Dictator } from './entities/dictator.entity';
import { Contestant } from 'src/contestants/entities/contestant.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Dictator, Contestant]),
    AuthModule, 
  ],
  controllers: [DictatorsController],
  providers: [DictatorsService],
  exports: [DictatorsService],
})
export class DictatorsModule {}