import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as any;

        if (!user || !user.tenantId) {
            throw new UnauthorizedException('Tenant context missing');
        }

        // Tenant ID is already validated by JWT strategy
        return true;
    }
}
