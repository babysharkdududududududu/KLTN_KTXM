import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateDormSubmissionDto {
    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;

    @IsNotEmpty({ message: "status không được để trống" })
    status: string;

    @IsString()
    @IsOptional()
    note?: string

    @IsString()
    @IsNotEmpty()
    settingId: string;

    @IsString()
    @IsNotEmpty()
    roomNumber: string;
}
