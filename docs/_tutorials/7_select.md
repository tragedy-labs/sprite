---
layout: tutorial
permalink: /tutorials/select.html
title: Sprite Tutorials - Select Records
name: Select Records
prevDesc: Create a Graph
prevUrl: /tutorials/createGraph.html
filename: 7_select.md
---

Abstractions for `selectOne` and `selectFrom` exists on `DocumentModality`, and `GraphModality`. You are welcome to write your own queries using the `SpriteDatabase.query` method as well.

This tutorial will cover all three of these methods.

#### Overview

1. [Prerequisites](#prerequisites)
2. [Instantiating SpriteDatabase](#instantiating-spritedatabase)
3. [SpriteDatabase.query](#spritedatabasequery)
5. [selectFrom](#spritedatabaseselectfrom)
4. [selectOne](#spritedatabaseselectone)
6. [Conclusion](#conclusion)
7. [What is next](#what-is-next)

#### Prerequisites

1. Ensure you have [the installation](../installation.html) completed. This means you have ArcadeDB installed, running, and accessible, as well as a TypeScript / JavaScript project with Sprite installed.
2. You have created a database called "ExampleDatabase", in the [Create a Database tutorial]().
3. You have a document in "ExampleDatabase", in the [Create a Document tutorial]().

#### Instantiating SpriteDatabase

Begin by inserting the following snippet into the `index.ts` file of your project. This imports the `SpriteDatabase` module, and creates an instance of it named `db`. TypeScript definitions for our example document table are also created.

```ts
// import the SpriteDatabase class from the sprite package
// The ArcadeDocument type will also be needed for this tutorial
import { type ArcadeDocument, SpriteDatabase } from '@tragedy-labs/sprite';

// create an instance of SpriteDatabase with your credentials
// and the name of the target database
const db = new SpriteDatabase({
  username: 'aUsername', // root will be ok for this tutorial
  password: 'aPassword', // your password,
  address: 'http://localhost:2480', // default address for ArcadeDB
  databaseName: 'ExampleDatabase' // the existing database
});

type ADocumentType = {
  aProperty: string;
};

type DocumentTypes = {
  aDocument: ADocumentType;
};
```

#### SpriteDatabase.query()

A simple query is written in SQL and sent via the `SpriteDatabase.query` method, it tells the database to select all documents of the `aDocument` type. The result of the query is logged. It should always be an array comprised of the [result set](https://en.wikipedia.org/wiki/Result_set). Result sets with one member will still be returned in an array.

```ts
async function selectQueryExample() {
  try {
    // ArcadeDB supports various query
    // lanagues, so it must be specified
    const result = await db.query<ArcadeDocument<ADocumentType>>(
      'sql',
      'SELECT * FROM aDocument'
    );

    // ArcadeDocument accepts a type parameter,
    // the resultant type will be the type defined
    // earlies, with ArcadeDB meta added to provide
    // an accurate type for the result set

    console.log(result);
    // [
    //   {
    //     '@rid': '#0:0',
    //     '@cat': 'd',
    //     '@type': 'aDocument',
    //     aProperty: 'aValue'
    //   }
    // ]
  } catch (error) {
    // handle error conditions
    throw new Error('An error occured while running the example', {
      cause: error
    });
  }
}
```

#### SpriteDatabase.selectFrom()

If you are working in a modality, there are higher-level methods to make common SQL operations easier. An example would be the `selectFrom` method. They build SQL queries based on the supplied options and return the result.

This example will create a typed modality instance to perform a query.

```ts
const client = db.documentModality<DocumentTypes>();

async function selectOneExample() {
  try {
    // types are inferred based on the type parameters
    // supplied to the modality when the client is
    // created.
    const result = await client.selectFrom('aDocument', {
      where: ['aProperty', '==', 'aValue']
    });

    console.log(result);
    // [
    //   {
    //     '@rid': '#0:0',
    //     '@cat': 'd',
    //     '@type': 'aDocument',
    //     aProperty: 'aValue'
    //   }
    // ]
  } catch (error) {
    // handle error conditions
    throw new Error('An error occured while running the example', {
      cause: error
    });
  }
}
```

#### SpriteDatabase.selectOne()

Sometimes only one specific record is needed. It can often be more performant than selecting from a type and filtering. The `selectOne` method is very straight forward, with no technical overhead compared to writing an SQL query to do it.

This example is somewhat complicated, because you need to know the `@rid` of the record in order to select one directly. First a record will be created in order to obtain the rid, and then we will query for it to show it is possible. It is a very contrived example.

```ts
const client = db.documentModality<DocumentTypes>();

async function selectOneExample() {
  try {

    // create a variable to store the rid
    let rid: string;

    // a transaction is invoked to create the document
    // and we set the rid variable the resultant records
    // @rid
    await transaction(async (trx) => {
      const doc = await client.createDocument('aDocument', trx, {
        data: {
          aProperty: 'aValue'
        }
      });
      rid = doc['@rid'];
    });

    // types are inferred in this case as well, but you must
    // supply the name of the type you are selecting as a
    // parameter, otherwise it will be unknown
    const result = await client.selectOne<'aDocument'>(rid);

    // selectOne will always return one record, so it will
    // always just be an object, no arrays involved
    console.log(result);
    // {
    //   '@rid': '#0:0',
    //   '@cat': 'd',
    //   '@type': 'aDocument',
    //   aProperty: 'aValue'
    // }
  } catch (error) {
    // handle error conditions
    throw new Error('An error occured while running the example', {
      cause: error
    });
  }
}
```

#### Conclusion

This tutorial has covered performing `select` queries using SQL via the `SpriteDatabase.query` method, and also via the `DocumentModality` using the `selectOne`, and `selectFrom` methods.

---

###### Note

The `selectOne` and `selectFrom` methods are also available on the `GraphModality`.

---

#### What is Next?

Go build something, or review the tutorials you might have skipped over. You could look at the documentation now that you have a good understanding of how Sprite works.

Some areas of interest not covered by tutorials are:

- DocumentModality.updateOne
- GraphModality.dropType