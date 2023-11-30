import { Length, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSongDto {
    @IsOptional()
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @IsOptional()
    @IsNumber()
    readonly sorting: number;
}