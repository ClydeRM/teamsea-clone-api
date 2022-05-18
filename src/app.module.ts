import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'], // Looking all Graphql schema
      playground: false, // Turn off GQL playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo sandbox replace GQL playground
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
