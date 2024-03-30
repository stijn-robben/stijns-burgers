import { Logger, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environment } from '@herkansing-cswp/shared/util-env';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItemModule } from '@herkansing-cswp/backend/features';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongo, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
            // console.log('is connected');
            Logger.verbose(
                `Mongoose db connected to ${environment.mongo}`
            );
        });
        connection._events.connected();
        return connection;
    }

    }),
    MenuItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}