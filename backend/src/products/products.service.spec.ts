import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PRODUCT_MESSAGES } from './constants/product-messages';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<ProductEntity>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a product', async () => {
      const createProductDto = {
        article: 'A001',
        name: 'Test Product',
        price: 100,
        quantity: 10,
      };
      mockProductRepository.findOne.mockResolvedValue(null);
      mockProductRepository.create.mockReturnValue(createProductDto);
      mockProductRepository.save.mockResolvedValue({ id: 1, ...createProductDto });

      const result = await service.create(createProductDto);
      expect(result).toEqual({ id: 1, ...createProductDto });
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { article: createProductDto.article },
      });
      expect(mockProductRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockProductRepository.save).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw ConflictException if product with article already exists', async () => {
      const createProductDto = {
        article: 'A001',
        name: 'Test Product',
        price: 100,
        quantity: 10,
      };
      mockProductRepository.findOne.mockResolvedValue({ id: 1, ...createProductDto });

      await expect(service.create(createProductDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createProductDto)).rejects.toThrow(
        PRODUCT_MESSAGES.ARTICLE_EXISTS(createProductDto.article),
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of products', async () => {
      const products = [{ id: 1, article: 'A001' }] as ProductEntity[];
      mockProductRepository.findAndCount.mockResolvedValue([products, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toEqual({ data: products, total: 1 });
      expect(mockProductRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe('update', () => {
    it('should successfully update a product', async () => {
      const updateProductDto = { name: 'Updated Name' };
      const existingProduct = { id: 1, article: 'A001', name: 'Old Name' } as ProductEntity;
      const updatedProduct = { ...existingProduct, ...updateProductDto } as ProductEntity;

      mockProductRepository.preload.mockResolvedValue(updatedProduct);
      mockProductRepository.findOne.mockResolvedValue(null);
      mockProductRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(mockProductRepository.preload).toHaveBeenCalledWith({ id: 1, ...updateProductDto });
      expect(mockProductRepository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.preload.mockResolvedValue(undefined);

      await expect(service.update(999, { name: 'Non Existent' })).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, { name: 'Non Existent' })).rejects.toThrow(
        PRODUCT_MESSAGES.NOT_FOUND(999),
      );
    });

    it('should throw ConflictException if article already exists for another product', async () => {
      const updateProductDto = { article: 'A002' };
      const existingProduct = { id: 1, article: 'A001' } as ProductEntity;
      const conflictingProduct = { id: 2, article: 'A002' } as ProductEntity;

      mockProductRepository.preload.mockResolvedValue(existingProduct);
      mockProductRepository.findOne.mockResolvedValue(conflictingProduct);

      await expect(service.update(1, updateProductDto)).rejects.toThrow(ConflictException);
      await expect(service.update(1, updateProductDto)).rejects.toThrow(
        PRODUCT_MESSAGES.ARTICLE_EXISTS(updateProductDto.article),
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove a product', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(PRODUCT_MESSAGES.NOT_FOUND(999));
    });
  });
});
