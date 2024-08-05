---
layout: tutorial
permalink: /tutorials/transactions.html
title: Sprite Tutorials - Database Transactions
name: Transactions
prevDesc: Create a Database
prevUrl: /tutorials/createDatabase.html
nextDesc: Select
nextUrl: /tutorials/select.html
filename: 4_transactions.md
---

ArcadeDB is a transactional database. This is preferred for applications that require a high level of data integrity. CRUD commands are required to be issued as part of a [transaction](https://en.wikipedia.org/wiki/Database_transaction) as a way to ensure [ACID compliance](https://en.wikipedia.org/wiki/ACID).

There are a few different ways to conduct transactions in Sprite. This tutorial will demonstate these methods, and explain why they are implemented as such in Sprite. As a warning, some code here might be daunting at first. It is not super important that you are an SQL expert, as long as you understand the basics of the transaction process.

---

###### Note:

You don't need to run this code; it will be put into practice in the next tutorial.

---

#### Overview

1. [Prerequisites](#prerequisites)
2. [Instantiating SpriteDatabase](#instantiating-spritedatabase)
3. [Manual Transactions](#manual-transactions)
4. [Transaction Helper](#transaction-helper)
5. [SpriteTransaction](#spritetransaction)
6. [Conclusion](#conclusion)
7. [What is next](#next)

#### Prerequisites

1. Ensure you have completed the [installation](./installation.html) process, which includes installing ArcadeDB, running it, and accessing it from a TypeScript/JavaScript project with Sprite installed.
2. You have created a database called "ExampleDatabase", as accomplished in the [Create a Database tutorial](./createDatabase.html)

#### Instantiating SpriteDatabase

The following code demonstrates how to create a new instance of `SpriteDatabase` in your project:

```ts
import { SpriteDatabase } from '@valence-corp/sprite';

const db = new SpriteDatabase({
  username: 'aUsername', // root will be ok for this tutorial
  password: 'aPassword', // your password,
  address: 'http://localhost:2480', // default address for ArcadeDB
  databaseName: 'ExampleDatabase' // the existing database
});
```

#### Transaction Helper

You can think of a transaction as a scope in which a series of commands are executed as a unit of work in the database, similar to how a function groups programmatic operations within a scope.

This example uses the `SpriteDatabase.transaction` method to create a transaction scope. The `transaction` method accepts one argument, which is a callback. Upon initialization, the `transaction` method creates a new `SpriteTransaction` instance and passes it as a parameter to the callback (named `trx` in this case).

```ts
async function transactionHelperExample() {
  try {
    // Ensure a type exists for the record we will create.
    // Schema changes are non-transactional, and non-idempotent.
    // They do not require a transaction.
    await db.command('sql', 'CREATE document TYPE aDocument');

    db.transaction(async (trx) => {
      // the `crud` method only exists on the SpriteTransaction
      // class. It is the only method of conduction transactional
      // operations in Sprite.
      const [record] = await trx.crud(
        'sql',
        `INSERT INTO aDocument CONTENT ${JSON.stringify(data)}`
      );
      console.log(record);
      // {
      //   '@rid': "#0:0",
      //   '@cat': 'd',
      //   '@type': 'aDocument',
      //   aProperty: 'aValue'
      // }
    });
  } catch (error) {
    throw new Error('There was an error during the example transaction', {
      cause: error
    });
  }
}
```

There is an SQL `crud` operation issued within the scope of the transaction callback. This tells the database that we intend to group this operation within the transaction scope. Remember that [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations are transactional in ArcadeDB.

The transaction executes the callback passed to it, and then automatically commits the transaction. This tells the database that the transaction is closed, and it can execute all operations as a unit of work.

Note that the `record` is logged to the console prior to the `transaction` closing. ArcadeDB will send the preliminary record immediately, but won't really add it to the database until the transaction is committed.

#### Manual Transactions

It could be necessary to manually orchestrate a transaction for greater control over the process. If something goes wrong before a transaction is committed (a powerloss, user error, or race condition), it might be necessary to rollback a transaction. This can be accomplished by using the `SpriteTransaction.rollback()` method.

This example creates a transaction (named `trx`). The transaction's `crud` method is invoked to create a document, finally we use the `rollback`, this ensures that the created record was not added to the database, and the transaction is closed.

```ts
async function manualTransaction() {
  try {
    // ensure a type exists prior to
    // attemping to insert a document
    await db.command('sql', 'CREATE document TYPE aDocument');

    const trx = await db.newTransaction();
    const [record] = await trx.crud(
      'sql',
      `INSERT INTO aDocument CONTENT ${JSON.stringify(data)}`
    );

    console.log(record);
    // {
    //   '@rid': "#0:0",
    //   '@cat': 'd',
    //   '@type': 'aDocument',
    //   aProperty: 'aValue'
    // }

    await trx.rollback();
    // await trx.commit();
  } catch (error) {
    throw new Error('There was an error during the example transaction', {
      cause: error
    });
  }
}
```

Note that the transaction also has a `commit` method, one could use that to commit the transaction instead.

#### Conclusion

In this tutorial, we demonstrated how to work with transactions in Sprite. We covered both manual transactions, and the transaction helper.

#### What's Next?

The next section will demonstrate the various method of performing a select query to retrieve records.
