import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities';
import { Repository } from 'typeorm';
import { Products } from './entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  /**
   * Verifies if a user exists in the database.
   *
   * @param {string} userId - The ID of the user to verify.
   * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
   *
   * This function takes a user ID and checks if a user with that ID exists in the database.
   * It does this by querying the `usersRepository` to find a user with the given ID.
   *
   * - If a user is found, the function returns true.
   * - If no user is found, the function returns false.
   *
   * This is useful for scenarios where you need to confirm the existence of a user before
   * performing further actions or operations.
   */

  private async userVerification(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async createProduct(req: any): Promise<Products> {
    const userId = req.user.userId;
    const createProductDto: CreateProductDto = req.body;
    try {
      // Verify if the user exists
      const user = await this.userVerification(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Create a new product instance and assign values
      const Product = new Products();
      Product.product_name = createProductDto.product_name;
      Product.product_description = createProductDto.product_description;
      Product.product_price = createProductDto.product_price;
      Product.product_image_url = createProductDto.product_image_url;

      // Save the product to the database

      const product = await this.productsRepository.save(Product);

      // Return the newly created product

      return product;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async findAllProducts(req: any): Promise<Products[]> {
    const userId = req.user.userId;
    try {
      const user = await this.userVerification(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const products = await this.productsRepository.find();
      return products;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async findOneProduct(req: any): Promise<Products> {
    const userId = req.user.userId;
    const productId = req.params.productId;

    try {
      const user = await this.userVerification(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const product = await this.productsRepository.findOne({
        where: {
          id: productId,
        },
      });
      return product;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async updateProduct(req: any): Promise<Products> {
    const userId = req.user.userId;
    const updateProductDto: UpdateProductDto = req.body;
    const productId = req.params.productId;
    try {
      const user = await this.userVerification(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.productsRepository.update(productId, updateProductDto);
      const product = await this.productsRepository.findOne({
        where: { id: productId },
      });
      return product;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async removeProduct(req: any): Promise<unknown> {
    try {
      const userId = req.user.userId;
      const productId = req.params.productId;
      const user = await this.userVerification(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const result = await this.productsRepository.delete(productId);
      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }
}
