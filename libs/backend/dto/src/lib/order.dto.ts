import { IsNotEmpty, IsEnum, IsNumber, IsDate, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IUser, Id } from '@herkansing-cswp/shared/api';
import { Status } from '@herkansing-cswp/shared/api';
import { CartItem } from '@herkansing-cswp/shared/api';

export class CreateOrderDto {
    @IsMongoId()
@ApiProperty({ type: () => String, description: 'User associated with the order' })
_id_user!: Id;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: () => Date, description: 'Order date' })
    order_date!: Date;

    @IsNotEmpty()
    @IsEnum(Status)
    @ApiProperty({ enum: Status, description: 'Order status' })
    status!: Status;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: () => Number, description: 'Total amount of the order' })
    total_amount!: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ type: () => Date, description: 'Estimated delivery time' })
    est_delivery_time!: Date;

    @IsNotEmpty()
    @ApiProperty({ type: () => [CartItem], description: 'Cart items associated with the order' })
    cart!: CartItem[];
}