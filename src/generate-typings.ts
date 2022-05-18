// Transform GQL schema to typescript definitions

import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'], // Looking all GQL schemas
  path: join(process.cwd(), 'src/graphql.ts'), // cwd() Current working Dir, Set CWD to be output Typings Dir
  outputAs: 'class',
  watch: true, // For Dev: If GQL schema is changed, auto regenerate typings class
});
