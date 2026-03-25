import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateTaskDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string'})
    @MinLength(5, { message: 'Name must be at lest 5 characters long'})
    readonly name?: string;

    @IsString({ message: 'Name must be a string'})
    @MinLength(5, { message: 'Name must be at lest 5 characters long'})
    readonly description?: string;

    @IsOptional()
    @IsBoolean()
    readonly completed?: boolean;
}
