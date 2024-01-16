import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSettingDto {

    @IsOptional()
    readonly value: any;

}
