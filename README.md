# Sprite

![Test workflow badge](https://github.com/tragedy-labs/sprite/actions/workflows/commit.yml/badge.svg?event=push)

Sprite is a TypeScript driver for ArcadeDB.

[Read the documentation](https://sprite.tragedy.dev), or see the examples below.

## Installation

(Use whichever package manager you prefer)

`<npm|pnpm|yarn|bun> <install|add> @tragedy-labs/sprite`

## Examples

### SpriteServer

```ts
@import { SpriteServer } from '@tragedy-labs/sprite';

const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480'
});

async function example() {

  const ready = await server.serverReady();
  console.log(ready);
  // true;

  try {
    const db = await server.createDatabase('aDatabase');
    console.log(db.name);
    // 'aDatabase'

    const result = await db.command(
      'sql',
      'CREATE document TYPE aType'
    );
    console.log(result);
    // [
    //   {
    //     operation: 'create document type',
    //     typeName: 'aType'
    //   }
    // ]

    // CRUD must be transactional
    // Parameterized commands are used to prevent
    // SQL injection, parameters are passed in an
    // object as the third argument
    db.transaction(async (trx) => {
      const doc = trx.crud(
        'sql',
        'INSERT INTO aType SET aProperty = :aValue',
        { aValue: 1 }
      );
    });
  } catch (error) {
    throw new Error('Could not create database', { cause: error });
  }
}

example();

```

### SpriteDatabase

```ts
@import { SpriteDatabase } from '@tragedy-labs/sprite';
@import type {
  CreateDocumentType,
  InsertDocument,
  SelectFrom
} from '@tragedy-labs/sprite';

const db = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aDatabase'
});

type ExampleDoc = {
  aValue: string;
};

async function example() {
  try {
    const created = await db.command<CreateDocumentType>(
      'sql',
      'CREATE document TYPE aType'
    );
    console.log(created);
    // [
    //   {
    //     operation: 'create document type',
    //     type: 'aType'
    //   }
    // ]

    const schema = await db.getSchema();
    console.log(schema);
    // [...]

    // CRUD must be part of a transaction
    // Parameterized commands are used to prevent
    // SQL injection, parameters are passed in an
    // object as the third argument.
    db.transaction(async (trx) => {
      await trx.crud(
        'sql',
        'INSERT INTO aType SET aProperty = :aValue',
        { aValue: 1 }
      );
    });

    const docs = await db.query<SelectFrom<ExampleDoc>>(
      'sql',
      'SELECT * FROM aType'
    );
    console.log(docs);
    // [
    //   {
    //     aProperty: 'aValue'
    //   }
    // ]

  } catch (error) {
    throw new Error('An error occured...', { cause: error });
  }
}

example();

```
