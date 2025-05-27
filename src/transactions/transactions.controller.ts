import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { TransactionsService } from './transactions.service';
  import { CreateTransactionDto } from './dto/create-transaction.dto';
  import { Transaction, TransactionStatus } from './entities/transaction.entity';
  
  @Controller('transactions')
  export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
      return this.transactionsService.create(createTransactionDto);
    }
  
    @Get()
    async findAll(): Promise<Transaction[]> {
      return this.transactionsService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Transaction> {
      return this.transactionsService.findOne(id);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      return this.transactionsService.remove(id);
    }
  
    @Post(':id/status')
    async updateStatus(
      @Param('id') id: string,
      @Body() { status }: { status: TransactionStatus }
    ): Promise<Transaction> {
      return this.transactionsService.updateStatus(id, status);
    }
  
    @Get('buyer/:buyerId')
    async findByBuyer(@Param('buyerId') buyerId: string): Promise<Transaction[]> {
      return this.transactionsService.findByBuyer(buyerId);
    }
  
    @Get('seller/:sellerId')
    async findBySeller(@Param('sellerId') sellerId: string): Promise<Transaction[]> {
      return this.transactionsService.findBySeller(sellerId);
    }
  }