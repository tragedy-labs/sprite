# Sprite

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

    await db.command('sql', 'CREATE document TYPE aType');
    console.log(result);
    // [
    //   {
    //     operation: 'create document type',
    //     typeName: 'aType'
    //   }
    // ]

    // CRUD must be transactional
    db.transaction(async (trx) => {
      const doc = db.crud(
        'sql',
        `INSERT INTO aType CONTENT ${JSON.stringify{ aProperty: 'aValue' }}`,
        trx
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

    // CRUD must be transactional
    db.transaction(async (trx) => {
      await db.crud<InsertDocument<ExampleDoc>>(
        'sql',
        `INSERT INTO aType CONTENT ${JSON.stringify{ aProperty: 'aValue' }}`,
        trx
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

### Documents (DocumentRespository)

The `DocumentRepository` handles higher-level functions for document records. The repository itself is generic in implementation, allowing it to manage different types of document records using type parameters. This means that one instance of the repository can handle all records within the document category.

```ts
@import { SpriteDatabase } from '@tragedy-labs/sprite';

const database = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aDatabase'
});

type DocumentTypes = {
  aDocument: {
    aProperty: string
  }
};

const client = database.documentRepository<DocumentTypes>();

async function example() {
  try {
    await client.createType('aDocument');

    // CRUD must be transactional
    await client.transaction(async (trx) => {
      const document = await client.newDocument(
        'aDocument',
        trx,
        {
          data: {
            aProperty: 'aValue'
          }
        }
      );
      console.log(document);
      // [
      //   {
      //     '@rid': '#0:0',
      //     '@cat': 'd',
      //     '@type': 'aDocument',
      //     aProperty: 'aValue'
      //   }
      // ]
    });
  } catch (error) {
    throw new Error('Could not create database', { cause: error });
  }
}

example();

```

### Graphs (GraphRepository)

Likewise, you can use a `GraphRepository` to perform operations on `vertex` or `edge` types. Creating a typed instance of the GraphRepository is the same as a DocumentRepository, but it accepts two type parameters, representing `vertex` and `edge` types to be associated with the repository.

```ts
@import { SpriteDatabase } from '@tragedy-labs/sprite';

const database = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aDatabase'
});

type VertexTypes = {
  aVertex: {
    aProperty: string
  }
};

type EdgeTypes = {
  anEdge: {
    aProperty: string
  }
};

const graph = database.graphRepository<VertexTypes, EdgeTypes>();

function example() {
  try {
    await graph.createVertexType('aVertex', trx);
    await graph.createEdgeType('anEdge', trx);
    graph.transaction(async (trx) => {
      const vertexA = await graph.newVertex(
        'aVertex',
        trx,
        {
          data: {
            aProperty: 'aValue'
          }
        }
      );
      const vertexB = await graph.newVertex(
        'aVertex',
        trx,
        {
          data: {
            aProperty: 'anotherValue'
          }
        }
      );
      const edge = await graph.newEdge(
        'anEdge',
        vertexA['@rid'],
        vertexB['@rid'],
        trx,
        {
          data: {
            aProperty: 'aValue',
          },
        },
      );
      console.log(edge);
      // [
      //   {
      //     '@rid': '#3:0',
      //     '@cat': 'e',
      //     '@type': 'anEdge',
      //     '@in': '#2:0',
      //     '@out': '#1:0,
      //     aProperty: 'aValue'
      //   }
      // ]
    });
  } catch (error) {
    throw new Error('Could not create database', { cause: error });
  }
}

example();

```
