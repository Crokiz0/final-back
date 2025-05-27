import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from './entities/battle.entity';
import { ContestantsModule } from '../contestants/contestants.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Battle]),
        ContestantsModule
    ],
    controllers: [BattlesController],
    providers: [BattlesService],
    exports: [BattlesService],
})
export class BattlesModule {}