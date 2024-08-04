---

layout: default

title: transaction

permalink: /GraphRepository/transaction.html

---

### _GraphRepository&lt;V, E&gt;_.transaction

#### Interface

(**callback: *SpriteTransactionCallback*, isolationLevel: *ArcadeTransactionIsolationLevel***)

Helps to manage a transaction, by automatically invoking `newTransation`,
and passing the returned `SpriteTransaction` to a callback as an argument,
to be passed to non-idempotent databases operations.

#### Example

```ts
const database = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aSpriteDatabase'
});

type DocTypes = {
  aType: {
    aField: string
  }
}

const client = database.documentRepository<DocTypes>();

async function transactionExample() {
  try {
    await client.createType('aType');
    const transaction = await client.transaction(async (trx) => {
      client.newDocument(
        'aType',
        trx,
        {
          aField: 'aValue'
        }
      );
    });
    console.log(transaction.id);
    // 'AS-0000000-0000-0000-0000-00000000000'
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

transactionExample();
```

