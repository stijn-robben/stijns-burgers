// class validators
import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsMongoId,
    IsOptional,
  } from 'class-validator';

//models
import { ICreateReview, IUpdateReview, IUpsertReview, Id } from '@herkansing-cswp/shared/api';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto implements ICreateReview {
    @IsMongoId()
    @IsOptional()
    _id?: Id;

    @ApiProperty({ description: 'The score of the review' })
    @IsInt()
    @IsNotEmpty()
    score!: number;

    @ApiProperty({ description: 'The description of the review' })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({ description: 'The ID of the user who wrote the review' })
    @IsMongoId()
    @IsOptional()
    _id_user!: Id;
}

export class UpsertReviewDto implements IUpsertReview {
    
  @IsMongoId()
  @IsOptional()
  _id!: Id;

  @ApiProperty({ description: 'The score of the review' })
  @IsInt()
  @IsNotEmpty()
  score!: number;

  @ApiProperty({ description: 'The description of the review' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'The ID of the user who wrote the review' })
  @IsMongoId()
  @IsOptional()
  _id_user!: Id;

}

export class UpdateReviewDto implements IUpdateReview {
    
  @IsMongoId()
  @IsOptional()
  _id?: Id;

  @ApiProperty({ description: 'The score of the review' })
  @IsInt()
  @IsNotEmpty()
  score!: number;

  @ApiProperty({ description: 'The description of the review' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  
}