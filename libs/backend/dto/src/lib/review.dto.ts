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

export class CreateReviewDto implements ICreateReview {
    
    @IsMongoId()
    @IsOptional()
    _id?: Id;

    @IsInt()
    @IsNotEmpty()
    score!: number;

    @IsString()
    @IsNotEmpty()
    description!: string;
}

export class UpsertReviewDto implements IUpsertReview {
    
  @IsMongoId()
  @IsOptional()
  _id!: Id;

  @IsInt()
  @IsNotEmpty()
  score!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class UpdateReviewDto implements IUpdateReview {
    
  @IsMongoId()
  @IsOptional()
  _id?: Id;

  @IsInt()
  @IsNotEmpty()
  score!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;
}