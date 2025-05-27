import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateSponsorDto {
    @IsString()
    @MinLength(3)
    readonly company_name: string;

    @IsString()
    @MinLength(3)
    readonly donated_items: string;

    @IsUUID()
    @IsOptional()
    readonly preferred_fighter?: string;
}