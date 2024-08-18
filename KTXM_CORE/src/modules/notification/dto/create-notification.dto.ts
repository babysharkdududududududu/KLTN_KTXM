import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsNotEmpty({ message: "Tiêu đề không được để trống" })
    @IsString({ message: "Tiêu đề phải là một chuỗi" })
    title: string;

    @IsNotEmpty({ message: "Nội dung thông báo không được để trống" })
    @IsString({ message: "Nội dung thông báo phải là một chuỗi" })
    message: string;


    @IsOptional()
    @IsString({ message: "Loại thông báo phải là một chuỗi" })
    type?: string;

    @IsOptional()
    sentAt?: Date;


}
