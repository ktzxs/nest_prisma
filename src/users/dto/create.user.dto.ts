import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    IsStrongPassword
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}