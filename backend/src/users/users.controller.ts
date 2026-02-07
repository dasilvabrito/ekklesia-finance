import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('ADMIN')
    findAll(@CurrentTenant() tenantId: string) {
        return this.usersService.findAll(tenantId);
    }
}
