---

layout: default

title: newTransaction

permalink: /SpriteDatabase/newTransaction.html

---

### _SpriteDatabase_.newTransaction

#### Interface

(**isolationLevel: *ArcadeTransactionIsolationLevel***)

Begins a transaction on the server, managed as a session.

#### Example

```ts
async function newTransactionExample() {
  try {
    await db.command(
      'sql',
      'CREATE document TYPE aType',
    );
    const trx = await db.newTransaction();
    const record = await db.command(
      'sql',
      'INSERT INTO aType',
      trx
    );
    trx.commit();
    return record;
  } catch (error) {
    console.log(error);
    // handle error conditions
  }
}

transactionExample();
```

