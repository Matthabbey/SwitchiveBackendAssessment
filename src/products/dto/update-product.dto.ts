import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsUrl, IsInt } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ example: 'switchive@gmail.com' })
  @IsString()
  readonly product_name: string;

  @ApiPropertyOptional({ example: 'Description of product name' })
  @IsString()
  readonly product_description: string;

  @ApiPropertyOptional({ example: 5504 })
  @IsInt()
  @IsNumber()
  readonly product_price: number;

  @ApiPropertyOptional({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  })
  @IsUrl()
  readonly product_image_url: string;
}
