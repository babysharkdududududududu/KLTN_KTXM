import { IsEmail, IsNotEmpty } from "class-validator";

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

    phone: string;
    address: string;
    image: string;
    dateOfBirth: Date;
    gender: string;

    @IsNotEmpty({ message: "role không được để trống" })
    role: string;
}
