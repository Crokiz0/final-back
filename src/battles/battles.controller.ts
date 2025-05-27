import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    HttpCode,
    HttpStatus,
    Patch,
} from '@nestjs/common';
import { BattlesService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { Battle } from './entities/battle.entity';

@Controller('battles')
export class BattlesController {
    constructor(private readonly battlesService: BattlesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createBattleDto: CreateBattleDto): Promise<Battle> {
        return this.battlesService.create(createBattleDto);
    }

    @Get()
    findAll(): Promise<Battle[]> {
        return this.battlesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Battle> {
        return this.battlesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateBattleDto: Partial<CreateBattleDto>): Promise<Battle> {
        return this.battlesService.update(id, updateBattleDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
        return this.battlesService.remove(id);
    }

    @Patch(':id/end')
    endBattle(
        @Param('id') id: string,
        @Body() endBattleData: { winner_id: string; death_occurred: boolean; injuries?: string }
    ): Promise<Battle> {
        return this.battlesService.endBattle(
            id,
            endBattleData.winner_id,
            endBattleData.death_occurred,
            endBattleData.injuries
        );
    }
}