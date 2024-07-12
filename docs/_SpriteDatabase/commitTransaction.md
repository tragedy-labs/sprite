---

layout: default

title: commitTransaction

permalink: /SpriteDatabase/commitTransaction.html

---

### _SpriteDatabase_.commitTransaction

#### Interface

(**transactionId: *string***)

Commits a transaction on the server, provided a transaction id.
Provide the id obtained from the transaction returned from invoking
`SpriteDatabase.newTransaction()`.

##### Note

---

You can use the `SpriteTransaction.commit()` method directly.

---

#### Example

```ts
async function commitTransactionExample() {
  try {
    const trx = await db.newTransaction();
    await db.command(
      'sql',
      'INSERT INTO aType',
    );

    console.log(trx.id);
    // 'AS-0000000-0000-0000-0000-00000000000'

    db.commitTransaction(trx.id);
  } catch (error) {
    console.log(error);
    // handle error conditions
  }
}

commitTransactionExample();
```

