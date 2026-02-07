import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async getSummary(tenantId: string, startDate?: string, endDate?: string) {
        // Default to last 30 days if no date range provided
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(end.getDate() - 30));

        const transactions = await this.prisma.transaction.findMany({
            where: {
                tenantId,
                date: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                category: true,
            },
        });

        let income = 0;
        let expense = 0;
        const categoryBreakdown: Record<string, number> = {};

        transactions.forEach((tx: any) => {
            const amount = Number(tx.amount);
            if (tx.category.type === 'INCOME') {
                income += amount;
            } else {
                expense += amount;
            }

            if (!categoryBreakdown[tx.category.name]) {
                categoryBreakdown[tx.category.name] = 0;
            }
            categoryBreakdown[tx.category.name] += amount;
        });

        return {
            period: { start, end },
            totals: {
                income,
                expense,
                net: income - expense,
            },
            categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
            transactions // Optional: return raw data for frontend CSV export
        };
    }
}
