import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'A001', description: 'Уникальный артикул товара' })
  @IsString()
  @IsNotEmpty()
  article: string;

  @ApiProperty({ example: 'Смартфон', description: 'Наименование товара' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 499.99, description: 'Цена товара' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 100, description: 'Количество товара на складе' })
  @IsNumber()
  @Min(0)
  quantity: number;
}
