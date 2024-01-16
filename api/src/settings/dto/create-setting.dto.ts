import { IsString, IsOptional } from 'class-validator';

export class CreateSettingDto {

    @IsString()
    readonly name: string;

    readonly value: any;

    @IsString()
    @IsOptional()
    readonly description: string;

}
