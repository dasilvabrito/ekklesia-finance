import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'super-secret-key',
        });
    }

    async validate(payload: any) {
        // Basic validation. In production, you might check if user still exists/is active.
        // Payload should contain sub (userId) and tenantId.
        if (!payload.sub || !payload.tenantId) {
            throw new UnauthorizedException('Invalid token payload');
        }
        return { userId: payload.sub, email: payload.email, role: payload.role, tenantId: payload.tenantId };
    }
}
