import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title!: string

    @IsNotEmpty()
    @IsString()
    description!: string

    @IsOptional()
    @IsBoolean()
    completed?: boolean

    @IsNotEmpty()
    @IsNumber()
    userId!: number
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsBoolean()
    completed?: boolean
}