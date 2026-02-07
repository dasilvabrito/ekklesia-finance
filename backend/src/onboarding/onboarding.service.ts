import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OnboardingService {
    constructor(private prisma: PrismaService) { }

    async createTenant(createTenantDto: CreateTenantDto) {
        const { churchName, slug, adminName, adminEmail, adminPassword } = createTenantDto;

        // Check if slug exists
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { slug },
        });

        if (existingTenant) {
            throw new BadRequestException('Tenant slug already exists');
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Transaction to ensure atomicity
        const result = await this.prisma.$transaction(async (prisma) => {
            // 1. Create Tenant
            const tenant = await prisma.tenant.create({
                data: {
                    name: churchName,
                    slug,
                    plan: 'FREE', // MVP Default
                },
            });

            // 2. Create Admin User
            const user = await prisma.user.create({
                data: {
                    name: adminName,
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    tenantId: tenant.id,
                },
            });

            // 3. Seed Chart of Accounts
            const defaultIncomeCategories = ['Dízimos', 'Ofertas', 'Doações', 'Eventos'];
            const defaultExpenseCategories = [
                'Aluguel',
                'Água',
                'Luz',
                'Manutenção',
                'Ação social',
                'Missionários',
                'Salários / prebendas',
            ];

            await prisma.accountCategory.createMany({
                data: [
                    ...defaultIncomeCategories.map((name) => ({
                        name,
                        type: 'INCOME' as const,
                        tenantId: tenant.id,
                    })),
                    ...defaultExpenseCategories.map((name) => ({
                        name,
                        type: 'EXPENSE' as const,
                        tenantId: tenant.id,
                    })),
                ],
            });

            return { tenant, user };
        });

        return result;
    }
}
