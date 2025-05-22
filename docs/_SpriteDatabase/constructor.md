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

Interacts with a database, performing queries and issuing commands to manage
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
      trx.crud('sql', 'INSERT INTO aDocument CONTENT { "aField": "aValue" }');
    });
    const schema = await db.getSchema();
    console.log(schema);
    // [...]
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
}

databaseExample();
```

