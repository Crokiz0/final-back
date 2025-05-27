import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sponsor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        nullable: false
    })
    company_name: string;

    @Column('varchar', {
        nullable: false
    })
    donated_items: string;

    @Column('uuid', {
        nullable: true
    })
    preferred_fighter: string;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
}