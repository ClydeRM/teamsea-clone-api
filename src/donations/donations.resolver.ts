import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { DonationsService } from './donations.service';

import { DonationCreateInput } from '../@generated/prisma-nestjs-graphql/donation/donation-create.input';
import { OrderByParams } from '../graphql';

// Subscription showing real time donations count update
const pubSub = new PubSub();

@Resolver('Donation')
export class DonationsResolver {
  constructor(private readonly donationsService: DonationsService) {}

  @Mutation('createDonation')
  async create(
    @Args('createDonationInput')
    createDonationInput: DonationCreateInput, //Prisma.DonationCreateInput
  ) {
    // Save the donation
    const created = await this.donationsService.create(createDonationInput);

    // Calculate new Update getTotal() data
    const total = await this.donationsService.getTotal();

    // Call Subscription publish('API Schema', { Obj });
    pubSub.publish('totalUpdated', { totalUpdated: { total } });

    return created;
  }

  @Subscription('totalUpdated')
  totalUpdated() {
    return pubSub.asyncIterator('totalUpdated');
  }

  @Query('donations')
  findAll(@Args('orderBy') orderBy?: OrderByParams) {
    return this.donationsService.findAll(orderBy);
  }

  @Query('donation')
  findOne(@Args('id') id: number) {
    return this.donationsService.findOne({ id });
  }

  @Query('totalDonations')
  totalDonations() {
    return this.donationsService.getTotal();
  }
}
