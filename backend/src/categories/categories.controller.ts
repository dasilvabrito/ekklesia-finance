import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @Roles('ADMIN', 'TREASURER')
    create(@CurrentTenant() tenantId: string, @Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(tenantId, createCategoryDto);
    }

    @Get()
    findAll(@CurrentTenant() tenantId: string) {
        return this.categoriesService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
        return this.categoriesService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'TREASURER')
    update(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(tenantId, id, updateCategoryDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
        return this.categoriesService.remove(tenantId, id);
    }
}
