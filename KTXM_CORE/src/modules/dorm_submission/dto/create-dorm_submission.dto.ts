import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateDormSubmissionDto {
    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;

    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    note?: string

    @IsString()
    @IsOptional()
    settingId: string;

    @IsString()
    @IsOptional()
    roomNumber?: string;
}
