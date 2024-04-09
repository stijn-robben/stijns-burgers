import { Controller, Get, Param } from '@nestjs/common';
import { IMenuItem } from '@herkansing-cswp/shared/api';
import { RecommendationService } from './recommendation.service';

console.log('RECOMMENDATIONS CONTROLLER');

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':id')
  async getRecommendationsForProduct(@Param('id') _id: string): Promise<IMenuItem[]> {
    console.log('RECOMMENDATIONS ', _id);
    return await this.recommendationService.generateRecommendations(_id);
  }
}