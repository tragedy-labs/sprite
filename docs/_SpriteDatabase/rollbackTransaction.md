---

layout: default

title: rollbackTransaction

permalink: /SpriteDatabase/rollbackTransaction.html

---

### _SpriteDatabase_.rollbackTransaction

#### Interface

(**transactionId: *string***)

Rolls back a transaction on the server. Provide the session id obtained with the `SpriteDatabase.newTransaction()` method.

#### Example

```ts
async function rollbackTransactionExample() {
  try {
    const trx = await db.newTransaction();
    await db.command(
      'sql',
      'INSERT INTO aType',
      trx
    );
    console.log(trx.id);
    // 'AS-0000000-0000-0000-0000-00000000000'
    db.rollbackTransaction(trx.id);
    return trx;
  } catch (error) {
    console.log(error);
    // handle error conditions
  }
}

rollbackTransactionExample();
```

