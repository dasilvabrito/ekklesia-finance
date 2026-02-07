import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  @Roles('ADMIN', 'TREASURER')
  create(@CurrentTenant() tenantId: string, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(tenantId, createTransactionDto);
  }

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    return this.transactionsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.transactionsService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TREASURER')
  update(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(tenantId, id, updateTransactionDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'TREASURER')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.transactionsService.remove(tenantId, id);
  }
}
