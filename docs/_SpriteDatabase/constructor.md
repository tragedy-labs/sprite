---

layout: default

title: constructor

permalink: /SpriteDatabase/constructor.html

---

### _SpriteDatabase_

#### Interface

(**params: *ISpriteDatabaseExistingSession***)

#### Interface

(**params: *ISpriteDatabaseNewSession***)

Interact with a database, perform queries, issue commands to manage
records, types, and settings.

#### Example

```ts
const db = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aDatabase'
});

type DocumentTypes = {
  aDocument: {
    aField: string
  }
}

async function databaseExample() {
 const client = db.documents<DocumentTypes>();
  try {
    await db.transaction(async (trx) => {
      await db.createType('aDocument', trx);
      db.createDocument('aDocument', trx, {
        data: {
          aField: 'aValue'
        }
      })
    });
    const schema = await db.getSchema();
    console.log(schema);
    // [...]
  } catch (error) {
    console.log(error);
    // handle error conditions
  }
}

databaseExample();
```

