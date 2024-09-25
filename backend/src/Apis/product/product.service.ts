import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/model/Product.model';
import { Repository } from 'typeorm';
import {
  ProductCreateDto,
  ProductSearchDto,
  ProductUpdateDto,
} from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepository: Repository<ProductModel>,
  ) {}

  async createProduct(payload: ProductCreateDto, shopId: number) {
    const product = this.productRepository.create({
      ...payload,
      shop: {
        id: shopId,
      },
    });
    await this.productRepository.save(product);
  }

  async updateProduct(
    shopId: number,
    productId: number,
    payload: ProductUpdateDto,
  ) {
    const { affected } = await this.productRepository.update(
      {
        shop: { id: shopId },
        id: productId,
      },
      payload,
    );

    if (affected === 0) throw new NotFoundException('Product not found');
  }

  async getProduct(
    shopId: number,
    { category, description, name, price }: ProductSearchDto,
  ) {
    let productQueryBuilder =
      this.productRepository.createQueryBuilder('product');

    // Filter by shopId
    if (shopId) {
      productQueryBuilder = productQueryBuilder.andWhere(
        'product.shopId = :shopId',
        {
          shopId,
        },
      );
    }

    // Filter by category using LIKE for partial matching
    if (category) {
      productQueryBuilder = productQueryBuilder.andWhere(
        'product.category LIKE :category',
        {
          category: `%${category}%`, // Using LIKE for pattern matching
        },
      );
    }

    // Filter by description using LIKE for partial matching
    if (description) {
      productQueryBuilder = productQueryBuilder.andWhere(
        'product.description LIKE :description',
        {
          description: `%${description}%`, // Using LIKE for pattern matching
        },
      );
    }

    // Filter by name using LIKE for partial matching
    if (name) {
      productQueryBuilder = productQueryBuilder.andWhere(
        'product.name LIKE :name',
        {
          name: `%${name}%`, // Using LIKE for pattern matching
        },
      );
    }

    // Filter by price range (gte and lte)
    if (price) {
      const { gte, lte } = price;

      if (gte !== undefined) {
        productQueryBuilder = productQueryBuilder.andWhere(
          'product.price >= :gte',
          {
            gte,
          },
        );
      }

      if (lte !== undefined) {
        productQueryBuilder = productQueryBuilder.andWhere(
          'product.price <= :lte',
          {
            lte,
          },
        );
      }
    }

    // Execute the query and return the result
    const result = await productQueryBuilder.getMany();
    return result;
  }

  async getProductById(shopId: number, productId: number) {
    const product = await this.productRepository.findOne({
      select: [
        'id',
        'name',
        'price',
        'category',
        'description',
        'availableQuantity',
      ],
      where: {
        id: productId,
        shop: { id: shopId },
      },
    });
    return product;
  }

  async getProductInventoryDetail(shopId: number, productId: number) {
    const data = await this.productRepository.findOne({
      relations: ['inventory', 'inventory.wareHouse'],
      where: {
        id: productId,
        shop: {
          id: shopId,
        },
      },
    });
    if (!data) throw new NotFoundException('Product not found');
    return data;
  }
}
