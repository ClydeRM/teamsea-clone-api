import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphqlDateTime } from 'graphql-iso-date';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonationsModule } from './donations/donations.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'], // Looking all Graphql schema
      playground: false, // Turn off GQL playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo sandbox replace GQL playground
      resolvers: { DateTime: GraphqlDateTime }, // Use for timestamp scalar
    }),
    DonationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
