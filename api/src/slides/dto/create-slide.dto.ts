import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSlideDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly content: string;

    @IsNumber()
    readonly songId: number;

    @IsNumber()
    @IsOptional()
    readonly sorting: number;
}
