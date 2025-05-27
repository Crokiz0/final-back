import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBattleDto {
    @IsUUID()
    readonly contestant_1_id: string;

    @IsUUID()
    readonly contestant_2_id: string;

    @IsUUID()
    @IsOptional()
    readonly winner_id?: string;

    @IsBoolean()
    @IsOptional()
    readonly death_occurred?: boolean;

    @IsString()
    @IsOptional()
    readonly injuries?: string;
}