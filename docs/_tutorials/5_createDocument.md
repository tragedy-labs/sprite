---
layout: tutorial
permalink: /tutorials/createDocument.html
title: Sprite Tutorials — Create a Document
name: Create a Document
nextDesc: Graphs
nextUrl: /tutorials/createGraph.html
prevDesc: Transations
prevUrl: /tutorials/transactions.html
filename: 5_createDocument.md
---
#### Introduction

Engineers tend to agree that sending a command directly to your database in its native query language is the most flexible and efficient method of conduction queries and database operations in a JavaScript application. It is, however, not always the easiest method to get started in building out your functionality.

Sprite has abstractions built over the database driver functionality of the `SpriteDatabase` class, called modalities. They contain typed methods that build SQL queries based on the arguments passed to them. Understand there is a certain level of overhead intrinsic to performing this type of work in JavaScript, and you should consider the best method for your application.

This tutorial will demonstrate the basics of using the `DocumentModality` via the `SpriteDatabase` module to define a document type, and create a document.

#### Overview

1. [Prerequisites](#prerequisites)
2. [Instantiating SpriteDatabase](#instantiating-spritedatabase)
3. [Accessing the DocumentModality](#accessing-the-documentmodality)
4. [Transactions](#transactions)
5. [Creating a database](#creating-a-document)
6. [Conclusion](#conclusion)
7. [What is next](#what-is-next)

#### Prerequisites

1. Ensure you have [the installation](./installation.html) completed. This means you have ArcadeDB installed, running, and accessible, as well as a TypeScript / JavaScript project with Sprite installed.
2. You have created a database called "ExampleDatabase", like in the [Create a Database tutorial](./createDatabase.html)

#### Instantiating SpriteDatabase

Begin by inserting the following snippet into the `index.ts` file of your project. This imports the `SpriteDatabase` module, and creates an instance of it named `db`.

```ts
// import the SpriteDatabase class from the sprite package
import { SpriteDatabase } from "@valence-corp/sprite";

// create an instance of SpriteDatabase with your credentials
// and the name of the target database
const db = new SpriteDatabase({
  username: "aUsername", // root will be ok for this tutorial
  password: "aPassword", // your password,
  address: "http://localhost:2480", // default address for ArcadeDB
  databaseName: "ExampleDatabase", // the existing database
});
```

#### Accessing the DocumentModality

Add the following code bellow the previous section.

The `DocumentModality` is accessed via the `SpriteDatabase` instance we created. Types are defined in the `ExampleDocument` interface and provided as a parameter to the `documentModality` accessor method.

```ts

// define some types to use for this example
interface ExampleDocuments {
  aDocument: {
    aProperty: string;
  };
  bDocument: {
    bProperty: number;
  };
}

// create an instance of the SpriteDatbase.documentModality
// with the types we wish to access as a parameter
const client = db.documentModality<ExampleDocuments>();

// create an async function to perform operations on the database
async function documentModalityExample() {
  try {
    // code from the tutorial will be inserted here
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error,
    });
  }
}

// call the example function
documentModalityExample();
```
---

###### Note


The accessor method returns a [singleton instance](https://en.wikipedia.org/wiki/Singleton_pattern) of `DocumentModality`. The library just uses the accessor method to define types for it, so you can create many typed modalities without any additional runtime overhead.

---

#### Transactions

ArcadeDB is a transactional database. This is preferred for applications that require a high level of data integrity. [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations must be part of a transaction.

Sprite has various methods for orchestrating transactions, but this tutorial will utilize the `DocumentModality.transaction()` method, which incorporates some abstraction to reduce boilerplate.

```ts
async function documentModalityExample() {
  try {
    // a transaction is created, it's only argument is
    // a callback (which is passed the transaction)
    client.transaction(async (trx) => {
      // ...operations go here
      // the transaction is automatically committed
      // following callback execution
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error,
    });
  }
}
```
---
###### Note

There is additional information on transactions in the following locations.

1. [Transactions Tutorial]({{page.baseurl}}transactions.html)
2. [Wikipedia: Database Transaction](https://en.wikipedia.org/wiki/Database_transaction)

---

#### Creating a Type

A type must be present in the database prior to creating a record of that type. The `DocumentModality.createType()` method is utilized to create a document type called "aDocument". This operation should be awaited to prevent an error with the `newDocument` method that will be added in the next step (as stated, the type must be present in the database to create a record of that type).

```ts
async function documentModalityExample() {
  try {
    await client.createType("aDocument");
    client.transaction(async (trx) => {
      // the transaction should be passed to all
      // non-idempotent commands issued herein
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error,
    });
  }
}
```

#### Creating a Document

Insert the `newDocument` method within the scope of the transaction callback, ensuring the transaction is passed to it as a second argument. Optionally, data can be included at record creation (as shown).

The arguments will be automatially typed as defined in the `ExampleDocuments` interface created earlier (the type name must be on that is included in the `ExampleDocuments` interface, and the `data` property will be typed based on that type name).

```ts
async function documentModalityExample() {
  try {
    client.transaction(async (trx) => {
      await client.createType("aDocument", trx);

      // create a new document with the type
      // created in the previous line, note that
      // the transaction is the second argument
      client.newDocument("aDocument", trx, {
        data: {
          aProperty: "aValue",
        },
      });
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error,
    });
  }
}
```


#### Running the Example

The complete example is show below. Ensure your code mirrors this, and execute.

```ts
import { SpriteDatabase } from "@valence-corp/sprite";

const db = new SpriteDatabase({
  username: "aUsername",
  password: "aPassword",
  address: "http://localhost:2480",
  databaseName: "ExampleDatabase",
});

interface ExampleDocuments {
  aDocument: {
    aProperty: string;
  };
  bDocument: {
    bProperty: number;
  };
}

const client = db.documentModality<ExampleDocuments>();

async function documentModalityExample() {
  try {
    await client.createType("aDocument");
    client.transaction(async (trx) => {
      client.newDocument("aDocument", trx, {
        data: {
          aProperty: "aValue",
        },
      });
    });
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error,
    });
  }
}

documentModalityExample();
```

#### Conclusion

There should now be a document in "ExampleDatabase" of "aDocument" type.

You could verify the existence of this document using the [ArcadeDB web interface](https://docs.arcadedb.com/#Studio), or by performing a query as shown in the [Select Tutorial]({{page.baseurl}}/select.html).

#### What is next?

The next section will demonstrate how to use the `GraphModality` to build a simple graph database.