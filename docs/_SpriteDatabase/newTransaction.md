---

layout: default

title: newTransaction

permalink: /SpriteDatabase/newTransaction.html

---

### _SpriteDatabase_.newTransaction

#### Interface

(**isolationLevel: *ArcadeTransactionIsolationLevel***)

Creates and returns a new SpriteTransaction.
Operations requiring the transaction should be executed using
the `crud()` method on the returned object. The
transaction can be committed using the `commit()` method, and
rolled-back by invoking `rollback()`.

#### Example

```ts
const db = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aSpriteDatabase'
});

type DocumentType = {
  aProperty: string
}

async function transactionExample() {
  try {
    await db.command<CreatDocumentType>(
      'sql',
      'CREATE document TYPE aType',
    );

    const trx = await db.newTransaction();
    await trx.crud<InsertDocument<DocumentType>(
      'sql',
      `INSERT INTO aType CONTENT ${JSON.stringify({ "aProperty": "aValue" })}`
    );
    await trx.commit();
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

transactionExample();
```

