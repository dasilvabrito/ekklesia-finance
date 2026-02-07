import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return (this.prisma as any).user.findMany({
            where: { tenantId },
            select: {
                id: true,
                email: true,
                role: true,
                transaction: {
                    take: 1
                }
            },
        });
    }
}
