import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderModel } from 'src/model/Order.model';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { CreateOrderDto, OrderSearchDto } from './order.dto';
import { OrderItemModel } from 'src/model/OrderItem.model';
import { ProductModel } from 'src/model/Product.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderModel)
    private orderRepository: Repository<OrderModel>,
    @InjectRepository(OrderItemModel)
    private orderItemRepository: Repository<OrderItemModel>,
    private dataSource: DataSource,
  ) {}

  async createOrder({ items, phoneNo }: CreateOrderDto, shopId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      // creating an order
      const orderCreate = this.orderRepository.create({
        phoneNo: phoneNo,
        shop: { id: shopId },
      });
      const order = await queryRunner.manager.save(orderCreate);
      for (const item of items) {
        // find inventory for product
        const product = await queryRunner.manager.findOne(ProductModel, {
          where: {
            id: item.productId,
            shop: {
              id: shopId,
            },
          },
        });

        if (!product)
          throw new NotFoundException(
            `Product not found with id ${item.productId}`,
          );

        if (product.availableQuantity - item.quantity < 0)
          throw new BadRequestException('Product is out of stock');

        product.availableQuantity -= item.quantity;
        await queryRunner.manager.save(product);

        // Create a new order item
        const orderItem = this.orderItemRepository.create({
          order: order,
          product: {
            id: item.productId,
          },
          quantity: item.quantity,
        });
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrders(shopId: number, { orderStatus, phoneNo }: OrderSearchDto) {
    const orderWhere: FindOptionsWhere<OrderModel> = {};
    orderWhere.shop = {
      id: shopId,
    };

    if (orderStatus) {
      orderWhere.orderStatus = orderStatus;
    }
    if (phoneNo) {
      orderWhere.phoneNo = phoneNo;
    }
    const orders = await this.orderRepository.find({
      where: orderWhere,
    });
    return orders;
  }

  async getOrderById(orderId: number, shopId: number) {
    const order = await this.orderRepository.findOneBy({
      shop: {
        id: shopId,
      },
      id: orderId,
    });
    return order;
  }

  async updateOrderStatus(
    orderId: number,
    shopId: number,
    orderStatus: 'todo' | 'inprogress' | 'done',
  ) {
    const { affected } = await this.orderRepository.update(
      {
        id: orderId,
        shop: {
          id: shopId,
        },
      },
      {
        orderStatus,
      },
    );
    if (affected === 0) throw new NotFoundException('Order Not Found');
  }
}
