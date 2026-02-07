import { IsDateString, IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTransactionDto {
    @IsDecimal()
    @IsNotEmpty()
    amount: number;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @IsString()
    @IsOptional()
    attachmentUrl?: string;
}
