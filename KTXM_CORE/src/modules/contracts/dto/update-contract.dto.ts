import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateContractDto {
    @IsNotEmpty({ message: 'contractNumber không được để trống' })
    contractNumber: string;
    
    @IsNotEmpty({ message: 'userId không được để trống' })
    userId: string;

    @IsNotEmpty({ message: 'roomId không được để trống' })
    roomNumber: string;

    @IsNotEmpty({ message: 'startDate không được để trống' })
    startDate: Date;

    @IsNotEmpty({ message: 'endDate không được để trống' })
    endDate: Date;
}
