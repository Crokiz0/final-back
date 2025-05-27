import { Controller, Get, Post, Body,Param, Delete,Put, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ContestantsService } from './contestants.service';
import { CreateContestantDto } from './dto/create-contestant.dto';
import { Contestant } from './entities/contestant.entity';

@Controller('contestants')
export class ContestantsController {
    constructor(private readonly contestantsService: ContestantsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createContestantDto: CreateContestantDto): Promise<Contestant> {
        return this.contestantsService.create(createContestantDto);
    }

    @Get()
    findAll(): Promise<Contestant[]> {
        return this.contestantsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Contestant> {
        return this.contestantsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateContestantDto: Partial<CreateContestantDto>): Promise<Contestant> {
        return this.contestantsService.update(id, updateContestantDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
        return this.contestantsService.remove(id);
    }

    @Patch(':id/wins')
    incrementWins(@Param('id') id: string): Promise<Contestant> {
        return this.contestantsService.incrementWins(id);
    }

    @Patch(':id/losses')
    incrementLosses(@Param('id') id: string): Promise<Contestant> {
        return this.contestantsService.incrementLosses(id);
    }
}