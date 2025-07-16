import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_MESSAGES } from './constants/product-messages';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const existingProduct = await this.productsRepository.findOne({
      where: { article: createProductDto.article },
    });
    if (existingProduct) {
      throw new ConflictException(PRODUCT_MESSAGES.ARTICLE_EXISTS(createProductDto.article));
    }
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(pagination: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: ProductEntity[]; total: number }> {
    const { page, limit, search } = pagination;
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (search) {
      queryBuilder.where(
        'LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.article) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productsRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND(id));
    }
    if (updateProductDto.article) {
      const existingProduct = await this.productsRepository.findOne({
        where: { article: updateProductDto.article },
      });
      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException(PRODUCT_MESSAGES.ARTICLE_EXISTS(updateProductDto.article));
      }
    }
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND(id));
    }
  }
}
