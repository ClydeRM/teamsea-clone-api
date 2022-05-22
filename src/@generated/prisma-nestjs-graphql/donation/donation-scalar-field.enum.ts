import { registerEnumType } from '@nestjs/graphql';

export enum DonationScalarFieldEnum {
    id = "id",
    count = "count",
    createdAt = "createdAt",
    displayName = "displayName",
    email = "email",
    mobile = "mobile",
    message = "message",
    teams = "teams"
}


registerEnumType(DonationScalarFieldEnum, { name: 'DonationScalarFieldEnum', description: undefined })
