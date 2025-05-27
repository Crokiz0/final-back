import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatus {
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    DISCOVERED = 'Discovered'
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    buyer_id: string;

    @Column('uuid')
    seller_id: string;

    @Column('varchar', {
        nullable: false
    })
    item: string;

    @Column('decimal', {
        precision: 10,
        scale: 2
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.COMPLETED
    })
    status: TransactionStatus;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
}