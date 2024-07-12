---
layout: tutorial
permalink: /tutorials/createDatabase.html
title: Sprite Tutorials - Create a Database
name: Create a Database
nextDesc: Transactions
nextUrl: /tutorials/transactions.html
prevDesc: Installation
prevUrl: /tutorials/installation.html
filename: 3_createDatabase.md
---

This tutorial will as an introduction to the `SpriteServer` module. It strives to implement all the functionality available in the [ArcadeDB Console](https://docs.arcadedb.com/#Console), but in a documented TypeScript interface. It is nearly feature complete, with settings being the only thing that is not currently ready to be deployed.

This tutorial will use `SpriteServer` to create a database.

#### Overview

1. [Prerequisites](#prerequisites)
2. [Instantiating SpriteServer](#instantiating-spriteserver)
3. [Async Operations](#async-operations)
4. [Check server status](#checking-server-status)
5. [Creating a database](#create-a-database)
6. [Running the Example](#running-the-example)
7. [Conclusion](#conclusion)
8. [What's Next?](#whats-next)

#### Prerequisites

1. Ensure you have completed the [installation](installation.html) process, which includes installing ArcadeDB, running it, and accessing it from a TypeScript/JavaScript project with Sprite installed.

#### Instantiating SpriteServer

Begin by inserting the following code into your project's `index.ts` file:

```ts
import { SpriteServer } from '@valence-corp/sprite';

const client = new SpriteServer({
  username: 'root',
  password: 'your_password', // replace with your password
  address: 'http://localhost:2480' // default address for ArcadeDB
});
```

#### Async Operations

Sprite uses the [ArcadeDB REST API](https://docs.arcadedb.com/#HTTP-API) to send commands and receive responses from the ArcadeDB Server. This means that Sprite's methods are always `async`. More often than not, you'll being using async / await (or promises) in your operations.

Insert the below code following the previous snippet.

```ts
async function createDatabaseExample() {
  try {
    // code from the tutorial goes here
  } catch (error) {
    throw new Error(`There was a problem while creating the database.`, {
      cause: error
    });
  }
}

createDatabaseExample();
```

#### Checking Server Status

It might be desirable to ensure the ArcadeDB server is ready prior to sending commands. The `SpriteServer.serverReady` method is made for that. Update the `createDatabaseExample()` function to include a server status check:

```ts
async function createDatabaseExample() {
  try {
    const ready = await client.serverReady();
    if (ready) {
      // perform creation operation here
    }
  } catch (error) {
    throw new Error(`There was a problem while running the example.`, {
      cause: error
    });
  }
}
```

If the server is not ready, an error will be thrown with a detailed error message. It's important to always handle errors in your code.

#### Creating a Database

Update the `createDatabaseExample()` function to create a database using the `SpriteServer.createDatabase` method.

The `createDatabase` method will return an instance of `SpriteDatabase`, which could be returned or used for database operations (more on that later).

```ts
async function createDatabaseExample() {
  try {
    const ready = await client.serverReady();
    if (ready) {
      const database = await client.createDatabase('ExampleDatabase');
      console.log(`${database.name} was created`);
      return database;
    }
  } catch (error) {
    throw new Error(`There was a problem while creating the database.`, {
      cause: error
    });
  }
}
```

#### Running the Example

The complete code is below. Ensure your code matches, and then execute it.

```ts
import { SpriteServer } from '@valence-corp/sprite';

const client = new SpriteServer({
  username: 'root',
  password: 'your_password', // replace with your password
  address: 'http://localhost:2480' // default address for ArcadeDB
});

async function createDatabaseExample() {
  try {
    const ready = await client.serverReady();
    if (ready) {
      const database = await client.createDatabase('ExampleDatabase');
      console.log(`${database.name} was created`);
      return database;
    }
  } catch (error) {
    throw new Error(`There was a problem while creating the database.`, {
      cause: error
    });
  }
}
```

#### Conclusion

You should now have a database on your server called "ExampleDatabase". You can verify the existence of the database using one of the following methods:

- [SpriteServer.listDatabases](../SpriteServer/listDatabases.html)
- [SpriteServer.databaseExists](../SpriteServer/databaseExists.html)
- [ArcadeDB server console](https://docs.arcadedb.com/#Console)

#### What's Next?

The next section will demonstrate the basics of transactional databases, and how transactions are conducted in Sprite.
