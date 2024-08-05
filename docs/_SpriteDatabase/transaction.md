---

layout: default

title: transaction

permalink: /SpriteDatabase/transaction.html

---

### _SpriteDatabase_.transaction

#### Interface

(**callback: **, isolationLevel: *ArcadeTransactionIsolationLevel***)

Creates a new transaction and passes it as an argument to a callback which
represents the transaction scope. The transaction is committed when the
callback resolves. The transaction can be rolled back by invoking
`SpriteTransaction.rollback()` within the callback.

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
    await db.transaction(async (trx) => {
      trx.crud<InsertDocument<DocumentType>(
        `INSERT INTO aType CONTENT ${JSON.stringify({ "aProperty": "aValue" })}`
      );
    });
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

transactionExample();
```

