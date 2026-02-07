import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    private readonlylogger = new Logger(AuditLogInterceptor.name);

    constructor(private prisma: PrismaService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, user, body, ip } = request as any;

        // Only log state-changing methods
        if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            return next.handle().pipe(
                tap(async () => {
                    try {
                        if (!user || !user.tenantId) return;

                        await this.prisma.auditLog.create({
                            data: {
                                action: this.mapMethodToAction(method),
                                resource: url, // Simplified resource name
                                details: JSON.stringify(method === 'DELETE' ? {} : body), // Be careful with sensitive data
                                ipAddress: ip || request.socket.remoteAddress,
                                userId: user.sub, // Assuming sub is userId from JWT
                                tenantId: user.tenantId,
                            },
                        });
                    } catch (error) {
                        this.logger.error(`Failed to create audit log`, error);
                    }
                }),
            );
        }

        return next.handle();
    }

    private mapMethodToAction(method: string): 'CREATE' | 'UPDATE' | 'DELETE' {
        switch (method) {
            case 'POST':
                return 'CREATE';
            case 'PATCH':
            case 'PUT':
                return 'UPDATE';
            case 'DELETE':
                return 'DELETE';
            default:
                return 'UPDATE';
        }
    }
}
