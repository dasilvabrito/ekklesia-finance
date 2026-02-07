import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    churchName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    slug: string; // Unique identifier for the church in URLs

    @IsString()
    @IsNotEmpty()
    adminName: string;

    @IsEmail()
    @IsNotEmpty()
    adminEmail: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    adminPassword: string;
}
