---

layout: default

title: transaction

permalink: /SpriteDatabase/transaction.html

---

### _SpriteDatabase_.transaction

#### Interface

(**callback: *SpriteTransactionCallback*, isolationLevel: *ArcadeTransactionIsolationLevel***)

Helps to manage a transaction by automatically invoking `newTransaction`,
and passing the returned `SpriteTransaction` to a callback as an argument,
to be passed to non-idempotent databases operations in the callback scope.
`SpriteTransaction.commit()` is called automatically after the callback
is executed.

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
      db.command<InsertDocument<DocumentType>(
        'aType',
        trx,
        {
          aProperty: 'aValue'
        }
      );
    });
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

transactionExample();
```

