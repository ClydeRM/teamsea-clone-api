# NestJS Graphql Prisma

###### tags: `NestJS`

##    Start Project
```
npm run dev // Watch API Schema/ Prisma Schema Nest App

>> Apollo-SandBox:  http:/localhost:3000/graphql

npx prisma studio // Studio-UI
>> Prisma-Studio:  http://localhost:5555
```
##    Project Structure
```
./teamsea
├── dist
    └── ...
├── node_module
    └── ...
├── prisma // prisma schema && migrate
    ├──migrations  // 不可以更動要且用Git追蹤
        ├── __date__migration_name
            └── migration_name.sql
        └── migration.toml
    ├── schema.prisma // DB Schema
    ├── seed.ts // Data seeding
    └── dev.db // SQLite
├── src 
    ├── @generated/prisma-nestjs-graohql // 參考schema.prisma 產生的 types class
        ├── donation // Donation Model的所有 types class 可以用作為Dto
            └── ...
        └── prisma // Prisma Schema 的其他Scalar的types class
            └── ...
    ├── donations
        ├── donations.graphql // API Schema
        ├── donations.module.ts
        ├── donations.resolver.ts // Endpoints 
        ├── donations.resolver.spec.ts
        ├── donations.service.ts // Business Logic
        └── donations.service.spec.ts
    ├── prisma
        ├── prisma.module.ts
        └── prisma.service.ts // 實作 Prisma Client
    └── test // e2e-testing
├── .env
├── package.json
├── package-lock.json
├── .gitignore
└── tsconfig.json
    
```
##    Package Version
> System Env
```>>
[System Information]
OS Version     : macOS Monterey
NodeJS Version : v16.15.0
NPM Version    : 8.5.5 

[Nest CLI]
Nest CLI Version : 8.2.6 

[Nest Platform Information]
platform-express version : 8.4.5
mapped-types version     : 1.0.1
schematics version       : 8.0.11
graphql version          : 10.0.11
testing version          : 8.4.5
apollo version           : 10.0.11
common version           : 8.4.5
core version             : 8.4.5
cli version              : 8.2.6
```
###    Package
####    Validation
* prisma-nestjs-graphql `npm i -D prisma-nestjs-graphql`
* class-validator.. `npm i --save class-validator class-transformer`
####    Prisma
* prisma `npm i -D prisma`
* @prisma/client `npm i @prisma/client`

####    Graphql(Apollo)
*  @nestjs/graphql ...etc
```
npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express
```

####    Generate-typings
* ts-morph `npm i -D ts-morph`

####    Concurrently (Exec Script)
* Concurrently
```
npm i -D concurrently
```

```>>
"@nestjs/common": "^8.0.0",
"@nestjs/core": "^8.0.0",
"@nestjs/graphql": "^10.0.11",
"@nestjs/mapped-types": "*",
"@nestjs/platform-express": "^8.0.0",

"prisma-nestjs-graphql": "^15.3.1",
"class-transformer": "^0.5.1",
"class-validator": "^0.13.2",

"@prisma/client": "^3.14.0",
"prisma": "^3.14.0",

"@nestjs/apollo": "^10.0.11",
"apollo-server-express": "^3.7.0",
"graphql": "^16.5.0",
"graphql-iso-date": "^3.6.1",
"graphql-subscriptions": "^2.0.0",
"ts-morph": "^14.0.0"
```

##    Script
###    Prisma
> npx prisma init // 初始化Prisma
> npx prisma migrate dev --name init // 初始化DB
> npx prisma db seed // Data Seeding
```>>
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "scripts": ...
}
```
###    Npm script

> dev : watch DB-schema API-schema NestApp
> gen-typings: 產生API type definitions
> prisma:generate : 產生 types class
```>> 
{
    "scripts":{
    "dev": "concurrently \"npm:start:dev\" \"npm:gen-typings\" \"npm:prisma:generate\"",
    "start:dev": "nest start --watch",
    "gen-typings": "ts-node ./src/generate-typings",
    "prisma:generate": "prisma generate --watch",
    }
}
```
##    Graphql-server (Apollo-server)
> Dep
```
npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express
```
##    Generate resource
###    CLI
```
nest g resource __Name__

? what transport layer do you use?
  REST API
  Graphql (code first)
> Graphql (schema first)
  Microservice
  WebSockets
```

##    Graphql schema to typings

> 將GQL Schema 自動轉換成 Typescript Definitions
```>>
>> /src/generate-typings.ts

import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'class',
  watch: true
});

>> /package.json

scripts:{
...,
"gen-typings":"ts-node generate-typings"

}

>>CLI 
npm run gen-typings
```

##    Graphql (Schema first)
> 設置GQL Module
```>>
>> /src/app.module.ts
...
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLDateTime } from 'graphql-iso-date';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'], // Looking all Graphql schema
      playground: false, // Turn off GQL playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo sandbox replace GQL playground
      resolvers: { DateTime: GraphQLDateTime }, // Use for timestamp scalar
    }),
    DonationsModule,
  ],
  controllers: [...],
  providers: [...],
})
export class AppModule {}
```

###    GQL Schema
> 定義 API資料傳輸的Schema
> 定義 這個模組的資料Schema Query Mutation Subscription
> ! 表示該資料scalar 一定要有
```>> 
>> /src/donations/donations.graphql

scalar DateTime

type Donation { // field
  id: Int! // scalar
  count: Int
  displayName: String!
  email: String!
  mobile: String
  team: String
  message: String
  createdAt: DateTime
  # GroupAgreement: Boolean 
}

input CreateDonationInput {
  count: Int
  displayName: String!
  email: String!
  mobile: String
  team: String
  message: String
  createdAt: DateTime  
}

type Query {
  donations: [Donation]!
  donation(id: Int!): Donation
}

type Mutation {
  createDonation(createDonationInput: CreateDonationInput!): Donation!
}

```

##    Prisma

###    Prisma Schema
> 定義 DB中的Data Schema

```>>
>> /prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 這邊用SQLITE
  url      = env("DATABASE_URL")
}

model Donation {
  id          Int      @id @default(autoincrement())
  count       Int
  createdAt   DateTime @default(now())
  displayName String
  email       String
  mobile      String?
  message     String?
  teams       String?
}


```

###    DB seeding
> 為Table 產生初始測試資料
```>>
>> /prisma/seed.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.donation.deleteMany(); // 清空Table
  const alice = await prisma.donation.create({
    data: {
      email: 'alice@prisma.io',
      displayName: 'Alice',
      count: 5,
    },
  });

  console.log({ alice });
}

main() // Doing the seeding script
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```
> 建立指令

```>>
>> /package.json

{
    "name": ...,
    "prisma":{ // 加入Prisma seeding script
        "seed: "ts-node prisma/seed.ts"
    },
    "scripts":{...}
}
```

> CLI >> npx prisma db seed

```>>
成功畫面
terminal % npx prisma db seed
Environment variables loaded from .env
Running seed command `ts-node prisma/seed.ts` ...
{
  alice: {
    id: 1,
    count: 5,
    createdAt: 2022-05-21T10:13:20.006Z,
    displayName: 'Alice',
    email: 'alice@prisma.io',
    mobile: null,
    message: null,
    teams: null
  }
}

🌱  The seed command has been executed.
```

> CLI>> npx prisma generate
> 產生 prisma client 使用query

##    Concurrently CLI
###    Install Concurrently
> ` npm i -D concurrently`

### Merge Script
> 同時執行多個Script
```>>
>> /package.json
{
    ...,
    "scripts":{
    "dev": "concurrently \"npm:start:dev\" \"npm:gen-typings\" \"npm:prisma:generate\"",
    "start:dev": "nest start --watch",
    "gen-typings": "ts-node ./src/generate-typings",
    "prisma:generate": "prisma generate --watch",
    },
    ...
}
```

##    Dto Validation
> 利用Prisma schema 跟GQL Schema 加入NestJS @decorator
> 產生typings class 與validationPipe()
> 驗證資料格式與內容

###    Dep ([prisma-nestjs-graphql](https://www.npmjs.com/package/prisma-nestjs-graphql))
> `npm i -D prisma-nestjs-graphql`

###    Implement
> Prisma Schema
> `///` 的註解會跟著編譯到prisma產生的type class
> 因此啟用generator，產生對應的schema.Dto
```>>
>> /prisma/schema.prisma

generator client {
    ...
}

generator nestjsgraphql {  // 使用prisma-nestjs-graphql 套件產生有驗證性Types class
  provider               = "node node_module/prisma-nestjs-graphql"
  output                 = "../src/@generated/prisma-nestjs-graphql"
  fields_Validator_from  = "class-validator"
  fields_Validator_input = true
}

datasource db {
  ...
}


model Donation {
  id          Int      @id @default(autoincrement())
  /// @Validator.IsInt()
  count       Int
  createdAt   DateTime @default(now())
  /// @Validator.MinLength(3)
  displayName String
  /// @Validator.IsEmail()
  email       String
  mobile      String?
  message     String?
  teams       String?
}
```
> main.ts
> whitelist 如果要啟用，我認為需要自己建立DTO
> forbidNonWhiteListed，也要同時啟用
```>>
>> /src/main.ts
...

async function bootstrap() {
  const app = await NestFactory....

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // 限制request，只傳入DTO規定的內容
      // transform: true, // 自動轉換 request Body, 將Body的型別成DTO的類別物件
      // forbidNonWhitelisted: true, // 抵擋request，如果request body有DTO規定外的欄位，request被攔截
    }),
  );
}

```
> Resolver.ts

```>>
>> /src/donation.resolver.ts
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
```

> Service.ts

```>>
>> /src/donation/donation.service.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { OrderByParams } from '../graphql';
import { DonationCreateInput } from '../@generated/prisma-nestjs-graphql/donation/donation-create.input';

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createDonationInput: DonationCreateInput) {
    return this.prisma.donation.create({
      data: createDonationInput,
    });
  }

  findAll(orderBy?: OrderByParams) {
    // Select orderBy present or count desc
    const { field = 'createdAt', direction = 'desc' } = orderBy || {};
    return this.prisma.donation.findMany({
      orderBy: { [field]: direction }, // [obj]: obj dynamic use obj
    });
  }

  findOne(donationWhereUniqueInput: Prisma.DonationWhereUniqueInput) {
    return this.prisma.donation.findUnique({
      where: donationWhereUniqueInput,
    });
  }

  async getTotal() {
    const response = await this.prisma.donation.aggregate({
      _sum: {
        count: true,
      },
    });
    return response._sum.count;
  }
}

```

##    Subscriptions

> 在app.module.ts中 GraphqlModule
> 設定subscriptions:{} 的設定

```>>
>> /src/app.module.ts
import ...

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'], // Looking all Graphql schema
      playground: false, // Turn off GQL playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo sandbox replace GQL playground
      resolvers: { DateTime: GraphQLDateTime }, // Use for timestamp scalar
      subscriptions: {
        'graphql-ws': true, // 給ReactUI用
        'subscriptions-transport-ws': true,// 給Apollo-Sandbox 用
      },
    }),
  ],
  ...
})
export class AppModule {}

```

###    Implement
> API Schema
> Donation.graphql

```>>
>> /src/donation/donation.graphql

...

type Result {
  total: Int!
}

type Subscription {
  # API_Name: Return_Field
  totalUpdated: Result
}
```

> Resolver.ts 實作
> 建立pubSub物件
> 如果有更新或是增加新資料：呼叫
> pubSub.publish(API_NAME:{OBJ})
> 實作 @Subscriptions()
> return pubSub.asyncIterator(API_NAME)
```>>
>> /src/donation/donation.resolver.ts

import ...
import { PubSub } from 'graphql-subscriptions';

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
}
```