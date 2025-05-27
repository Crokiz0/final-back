import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ContestantStatus } from '../entities/contestant.entity';

export class CreateContestantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsString()
    @IsNotEmpty()
    origin: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    strength?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    agility?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    wins?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    losses?: number;

    @IsEnum(ContestantStatus)
    @IsOptional()
    status?: ContestantStatus;
}
