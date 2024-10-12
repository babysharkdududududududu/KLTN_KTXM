import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;

    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: 'email không đúng định dạng' })
    email: string;

    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsOptional() // Thêm @IsOptional() cho trường phone
    phone?: string;

    @IsOptional() // Thêm @IsOptional() cho trường address
    address?: string;

    @IsOptional() // Thêm @IsOptional() cho trường image
    image?: string;

    @IsOptional() // Thêm @IsOptional() cho trường dateOfBirth
    dateOfBirth?: Date;

    @IsOptional() // Thêm @IsOptional() cho trường gender
    gender?: string;

    @IsNotEmpty({ message: "role không được để trống" })
    role: string;

    @IsOptional() // Thêm @IsOptional() cho trường class
    class?: string;

    @IsOptional() // Thêm @IsOptional() cho khoa faculty
    faculty?: string;
}
