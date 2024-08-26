import { IsNotEmpty } from 'class-validator';

export class DeleteContractDto {
    @IsNotEmpty({ message: 'userId không được để trống' })
    userId: string;
}
