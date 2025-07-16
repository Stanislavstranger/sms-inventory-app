import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Товары')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание нового товара' })
  @ApiResponse({ status: 201, description: 'Товар успешно создан.' })
  @ApiResponse({ status: 409, description: 'Товар с таким артикулом уже существует.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение списка всех товаров с пагинацией' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество товаров на странице',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Поиск по названию или артикулу',
    example: 'Хлеб',
  })
  @ApiResponse({ status: 200, description: 'Возвращает список товаров.' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll({ page, limit, search });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление существующего товара' })
  @ApiParam({ name: 'id', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен.' })
  @ApiResponse({ status: 404, description: 'Товар не найден.' })
  @ApiResponse({ status: 409, description: 'Товар с таким артикулом уже существует.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление товара' })
  @ApiParam({ name: 'id', type: Number, description: 'ID товара' })
  @ApiResponse({ status: 200, description: 'Товар успешно удален.' })
  @ApiResponse({ status: 404, description: 'Товар не найден.' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
