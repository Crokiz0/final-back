import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({ 
      order: { created_at: 'DESC' } 
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }
    
    return transaction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const transaction = await this.findOne(id);
    transaction.status = status;
    return this.transactionRepository.save(transaction);
  }

  async findByBuyer(buyerId: string): Promise<Transaction[]> {
    return this.findByUser('buyer_id', buyerId);
  }

  async findBySeller(sellerId: string): Promise<Transaction[]> {
    return this.findByUser('seller_id', sellerId);
  }

  private async findByUser(
    field: 'buyer_id' | 'seller_id', 
    userId: string
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { [field]: userId },
      order: { created_at: 'DESC' }
    });
  }
}