import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createCategoryDto: CreateCategoryDto) {
        return this.prisma.accountCategory.create({
            data: {
                ...createCategoryDto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.accountCategory.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        return this.prisma.accountCategory.findFirst({
            where: { id, tenantId },
        });
    }

    async update(tenantId: string, id: string, updateCategoryDto: UpdateCategoryDto) {
        // Ensure the category belongs to the tenant before updating
        // Prisma delete/updateMany with where clause is safer but findFirstOrThrow + update is explicit
        const category = await this.prisma.accountCategory.findFirst({ where: { id, tenantId } });
        if (!category) {
            throw new Error('Category not found');
        }

        return this.prisma.accountCategory.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(tenantId: string, id: string) {
        const category = await this.prisma.accountCategory.findFirst({ where: { id, tenantId } });
        if (!category) {
            throw new Error('Category not found');
        }
        return this.prisma.accountCategory.delete({
            where: { id },
        });
    }
}
