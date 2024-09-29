import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateDormSubmissionDto {
    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;

    @IsString()
    @IsOptional()
    note?: string

    @IsString()
    @IsNotEmpty()
    settingId: string;

    @IsString()
    @IsOptional()
    roomNumber?: string;
}
