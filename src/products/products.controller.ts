import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard, AllExceptionsFilter } from 'src/middlewares';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@UseFilters(AllExceptionsFilter) //Here
@UsePipes(new ValidationPipe())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'product successfully created' })
  @Post('create')
  create(@Req() req: Request, @Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(req);
  }

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'retrieve products successfully' })
  @Get()
  findAll(@Req() req: Request) {
    return this.productsService.findAllProducts(req);
  }

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'product retrieve successfully' })
  @Get(':productId')
  findOne(@Req() req: Request, @Param('productId') productId: string) {
    return this.productsService.findOneProduct(req);
  }

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'update product successfully' })
  @Patch(':productId')
  update(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(req);
  }

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'product successful removed' })
  @Delete(':productId')
  remove(@Req() req: Request, @Param('productId') productId: string) {
    return this.productsService.removeProduct(req);
  }
}
