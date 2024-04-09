import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { IUser, ICartItem, IOrder, IMenuItem } from '@herkansing-cswp/shared/api';

@Injectable()
export class RecommendationService {
  private readonly logger: Logger = new Logger(RecommendationService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async createOrUpdateUser(user: IUser) {
    console.log('createOrUpdateUser' + user)
    const result = await this.neo4jService.write(
      `
      MERGE (u:User { _id: $id })
      ON CREATE SET u.name = $name
      ON MATCH SET u.name = $name
      RETURN u
    `,
      {
        id: user._id?.toString(),
        name: user.firstName,
      }
    );
    console.log('resultNEO', result);
    console.log('NEO', user._id?.toString(), user.firstName + ' ' + user.lastName);

    return result;
  }

  async deleteUserNeo(userId: string) {
    this.logger.log(`Deleting user with ID: ${userId}`);

    const result = await this.neo4jService.write(
      `
      MATCH (u:User { _id: $userId })
      DETACH DELETE u
    `,
      {
        userId,
      }
    );

    return result;
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

    const result = await this.neo4jService.write(
      `
      MATCH (u:User { _id: $userId })-[r:ADDED_TO_CART]->(m:MenuItem { _id: $menuItemId })
      DELETE r
    `,
      {
        userId,
        menuItemId,
      }
    );

    return result;
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