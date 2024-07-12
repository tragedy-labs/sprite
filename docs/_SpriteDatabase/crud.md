---

layout: default

title: crud

permalink: /SpriteDatabase/crud.html

---

### _SpriteDatabase_.crud

#### Interface

(**language: *ArcadeSupportedQueryLanguages*, command: *string*, transaction: *SpriteTransaction***)

A method for issuing commands that perform CRUD.
This method is a safer way to write functionality as the transaction
argument is not optional.

#### Example

```ts
async function crudExample() {
  try {
    const trx = await db.newTransaction();
    const record = await db.crud(
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
```

