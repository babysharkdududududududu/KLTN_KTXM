import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContractDto {
    @IsNotEmpty({ message: 'contractNumber không được để trống' })
    contractNumber: string;

    @IsNotEmpty({ message: 'userId không được để trống' })
    userId: string;

    @IsNotEmpty({ message: 'roomId không được để trống' })
    roomNumber: string;

    @IsOptional()
    startDate: Date;

    @IsOptional()
    endDate: Date;
}
