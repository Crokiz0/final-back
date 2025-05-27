import { IsEnum, IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
    @IsUUID()
    readonly buyer_id: string;

    @IsUUID()
    readonly seller_id: string;

    @IsString()
    @MinLength(3)
    readonly item: string;

    @IsNumber()
    @Min(0)
    readonly amount: number;

    @IsEnum(TransactionStatus)
    readonly status: TransactionStatus;
}