import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    IsStrongPassword
} from "class-validator";

export class SingInDto {
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