---
layout: tutorial
permalink: /tutorials/select.html
title: Sprite Tutorials - Select Records
name: Select Records
prevDesc: Transactions
prevUrl: /tutorials/transactions.html
filename: 5_select.md
---

This tutorial will cover selecting records using the `SpriteDatabase.query()` method.

#### Overview

1. [Prerequisites](#prerequisites)
2. [Instantiating SpriteDatabase](#instantiating-spritedatabase)
3. [SpriteDatabase.query](#spritedatabasequery)
4. [Conclusion](#conclusion)
5. [What is next](#what-is-next)

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
    // earlier, with ArcadeDB meta added to provide
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

#### Conclusion

This tutorial has covered performing `select` queries using SQL via the `SpriteDatabase.query` method.

---

#### What is Next?

Build something, or review the tutorials you might have skipped over. You could look at the documentation now that you have a good understanding of how Sprite works.
