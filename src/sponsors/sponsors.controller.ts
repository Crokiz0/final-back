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
    Query,
} from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { Sponsor } from './entities/sponsor.entity';

@Controller('sponsors')
export class SponsorsController {
    constructor(private readonly sponsorsService: SponsorsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
        return this.sponsorsService.create(createSponsorDto);
    }

    @Get()
    findAll(@Query('fighter') fighterId?: string): Promise<Sponsor[]> {
        if (fighterId) {
            return this.sponsorsService.findByFighter(fighterId);
        }
        return this.sponsorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Sponsor> {
        return this.sponsorsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSponsorDto: Partial<CreateSponsorDto>): Promise<Sponsor> {
        return this.sponsorsService.update(id, updateSponsorDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
        return this.sponsorsService.remove(id);
    }
}