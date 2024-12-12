import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateDormSubmissionDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    userId: string;

    @IsOptional()
    status: string;

    @IsOptional()
    note: string;

    @IsOptional()
    documents: string[];
}
