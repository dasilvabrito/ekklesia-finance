import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  async create(tenantId: string, createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.transaction.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.transaction.findFirst({
      where: { id, tenantId },
      include: { category: true },
    });
  }

  async update(tenantId: string, id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.findFirst({ where: { id, tenantId } });
    if (!transaction) throw new Error('Transaction not found');

    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  async remove(tenantId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({ where: { id, tenantId } });
    if (!transaction) throw new Error('Transaction not found');

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
