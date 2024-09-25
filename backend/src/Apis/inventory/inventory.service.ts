import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryModel } from 'src/model/Inventory.model';
import { DataSource, Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { WareHouseModel } from 'src/model/WareHouse.model';
import { ProductModel } from 'src/model/Product.model';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryModel)
    private readonly inventoryRepository: Repository<InventoryModel>,
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  async addInventory(
    shopId: number,
    productId: number,
    quantity: number,
    wareHouseId: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Start transaction
      await queryRunner.startTransaction('REPEATABLE READ');

      // Check if the product exists
      // const product = await this.productService.getProductById(
      //   shopId,
      //   productId,
      // );
      const product = await queryRunner.manager.findOne(ProductModel, {
        where: {
          id: productId,
          shop: {
            id: shopId,
          },
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      product.availableQuantity += quantity;

      // Find or create inventory record
      let inventory = await queryRunner.manager.findOne(InventoryModel, {
        where: {
          product: { id: productId, shop: { id: shopId } },
          wareHouse: {
            id: wareHouseId,
          },
        },
      });

      // warehouse
      const wareHouse = await queryRunner.manager.findOne(WareHouseModel, {
        where: {
          id: wareHouseId,
          shop: {
            id: shopId,
          },
        },
      });

      if (!wareHouse) throw new NotFoundException('Warehouse not found');

      if (inventory) {
        // Update inventory quantity
        inventory.quantity += quantity;
      } else {
        // Create new inventory record
        inventory = this.inventoryRepository.create({
          quantity,
          product: {
            id: productId,
          },
          wareHouse: {
            id: wareHouseId,
          },
        });
      }

      // Save the inventory record
      await queryRunner.manager.save(inventory);

      // Update quantity in Product
      await queryRunner.manager.save(product);

      // Commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async consumeInventory(
    shopId: number,
    productId: number,
    quantity: number,
    wareHouseId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction('REPEATABLE READ');

    try {
      const inventory = await queryRunner.manager.findOne(InventoryModel, {
        where: {
          wareHouse: {
            id: wareHouseId,
            shop: {
              id: shopId,
            },
          },
          product: {
            id: productId,
          },
        },
      });
      if (inventory.quantity - quantity < 0)
        throw new BadRequestException('Insufficient Inventory');

      inventory.quantity -= quantity;
      await queryRunner.manager.save(inventory);
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
