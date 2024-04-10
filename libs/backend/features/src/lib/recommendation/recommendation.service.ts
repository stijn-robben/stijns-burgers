import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { IUser, ICartItem, IOrder, IMenuItem } from '@herkansing-cswp/shared/api';
@Injectable()
export class RecommendationService {
  private readonly logger: Logger = new Logger(RecommendationService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async createUser(userId: string) {
    try {
      this.logger.log(`Creating user with ID: ${userId}`);
  
      console.log('createOrUpdateUser' + userId)
      const result = await this.neo4jService.write(
        `
        MERGE (u:User { _id: $id })
        RETURN u
      `,
        {
          id: userId,
        }
      );
      console.log('resultNEO', result);
  
      return result;
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
    }
    return null;
  }

  async addMenuItemToUserCart(userId: string, menuItemId: string) {
    this.logger.log(`Adding menuitem to user cart`);

    const result = await this.neo4jService.write(
      `
      MATCH (u:User { _id: $userId }), (m:MenuItem { _id: $menuItemId })
      MERGE (u)-[:ADDED_TO_CART]->(m)
      RETURN u, m
    `,
      {
        userId,
        menuItemId,
      }
    );

    return result;
  }

  async deleteItemFromUserCart(userId: string, menuItemId: string) {
    this.logger.log(`Deleting menuitem ${menuItemId} from user ${userId}'s cart`);
  
    const matchResult = await this.neo4jService.write(
      `
      MATCH (u:User { _id: $userId })-[r:ADDED_TO_CART]->(m:MenuItem { _id: $menuItemId })
      RETURN u, m, r
      `,
      {
        userId,
        menuItemId,
      }
    );
  
    console.log(matchResult);
  
    const deleteResult = await this.neo4jService.write(
      `
      MATCH (u:User { _id: $userId })-[r:ADDED_TO_CART]->(m:MenuItem { _id: $menuItemId })
      DELETE r
      RETURN u, m
      `,
      {
        userId,
        menuItemId,
      }
    );
  
    return deleteResult;
  }

  async createOrUpdateMenuItem(menuitem: IMenuItem) {
    this.logger.log(`Creating or updating menuitem`);

    const result = await this.neo4jService.write(
      `
      MERGE (m:MenuItem { _id: $id })
      ON CREATE SET m.name = $name, m.description = $description, m.price = $price, m.img_url = $img_url
      ON MATCH SET m.name = $name, m.description = $description, m.price = $price, m.img_url = $img_url
      RETURN m
    `,
      {
        id: menuitem._id?.toString(),
        name: menuitem.name,
        description: menuitem.description,
        price: menuitem.price,
        img_url: menuitem.img_url,
      }
    );

    return result;
  }

  async deleteMenuItemNeo(menuItemId: string) {
    this.logger.log(`Deleting menuitem with ID: ${menuItemId}`);

    const result = await this.neo4jService.write(
      `
      MATCH (m:MenuItem { _id: $menuItemId })
      DETACH DELETE m
    `,
      {
        menuItemId,
      }
    );

    return result;
  }

  async generateRecommendations(menuItemId: string): Promise<IMenuItem[]> {
    this.logger.log(
      `Generating recommendations for user with ID: ${menuItemId}`
    );

    const result = await this.neo4jService.read(
      `
      MATCH (u:User)-[:ADDED_TO_CART]->(:MenuItem { _id: $menuItemId })
      WITH COLLECT(u) AS users
      MATCH (u)-[:ADDED_TO_CART]->(m1:MenuItem { _id: $menuItemId })
      MATCH (u)-[:ADDED_TO_CART]->(otherMenuItem:MenuItem)
      WHERE u IN users AND otherMenuItem <> m1
      RETURN otherMenuItem, COUNT(*) AS count
      ORDER BY count DESC
      LIMIT 5
    `,
      {
        menuItemId,
      }
    );

    return result.records.map(
      (record) => record.get('otherMenuItem').properties as IMenuItem
    );
  }
}