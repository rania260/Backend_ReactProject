import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class SignUpDto{
    
    @IsNotEmpty()
    @IsString()
    readonly username : string;
   
    @IsNotEmpty()
    @IsEmail({},{message: "please enter correct email"})
    email: string;
   
    @IsNotEmpty()
    @IsString() 
    @MinLength(6)
    password:string;
}