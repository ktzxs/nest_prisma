import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
    @IsString({ message: 'Name must be a string'})
    @MinLength(5, { message: 'Name must be at lest 5 characters long'})
    @IsNotEmpty({ message: 'Name is required' })
    readonly name: string;
    
    @IsString({ message: 'Description must be a string'})
    @MinLength(10, { message: 'Description mus be at least 10 characters long' })
    @IsNotEmpty({ message: 'Name is required' })
    readonly description: string;
}