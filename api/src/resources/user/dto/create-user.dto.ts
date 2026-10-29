import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ada Lovelace', maxLength: 45 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name: string;

  @ApiProperty({ example: 'ada@example.com', maxLength: 45 })
  @IsEmail()
  @MaxLength(45)
  email: string;

  @ApiProperty({ example: 'secure-password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'ada', maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  github: string;
}
