import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('summary')
    @Roles('ADMIN', 'TREASURER', 'AUDITOR')
    getSummary(
        @CurrentTenant() tenantId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.reportsService.getSummary(tenantId, startDate, endDate);
    }
}
