import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSlideDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly content: string;

    @IsOptional()
    @IsNumber()
    readonly sorting: number;

}
