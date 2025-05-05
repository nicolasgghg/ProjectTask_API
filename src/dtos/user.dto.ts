import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    name!: string
 
    @IsNotEmpty()
    @IsEmail()
    email!: string
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string
}

export class UpdateUserDto{
    
    @IsOptional()
    id?: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string
 
    @IsOptional()
    @IsEmail()
    email?: string
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password?: string
}