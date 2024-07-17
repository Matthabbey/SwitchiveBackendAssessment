import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'switchive@gmail.com' })
  @IsString()
  readonly product_name: string;

  @ApiProperty({ example: 'Description of product name' })
  @IsString()
  readonly product_description: string;

  @ApiProperty({ example: 5504 })
  @IsInt()
  @IsNumber()
  readonly product_price: number;

  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  })
  @IsUrl()
  readonly product_image_url: string;
}
