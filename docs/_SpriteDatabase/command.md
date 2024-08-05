---

layout: default

title: command

permalink: /SpriteDatabase/command.html

---

### _SpriteDatabase_.command

#### Interface

(**language: *ArcadeSupportedQueryLanguages*, command: *string*, parameters: *Record&lt;string, any&gt;***)

Executes a command on the target database. This method should only be used
for non-transactional, non-idempotent statements such as: `CREATE`, `ALTER`, or `DROP`.

CRUD operations must be part of a transaction, otherwise changes will not persist.
Use the `SpriteTransaction.crud()` for this purpose.

If you are trying to execute idempotent commands see `SpriteDatabase.query()`.

##### Note

---

This package includes type definitions to help you issue commands with typed return values.

```ts
db.command<CreateDocumentType>(
  'sql',
  'CREATE document TYPE DocumentType'
);
```

---

#### Example

```ts
const db = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aDatabase'
});

async function spriteCommandExample() {
  try {
    const result = await db.command<CreateDocumentType>(
      'sql',
      'CREATE document TYPE aType',
    );
    console.log(result);
    // [ { operation: 'create document type', typeName: 'aType' } ]
    return result;
  } catch (error) {
    // handle error conditions
    console.error(error);
  }
};

spriteCommandExample();
```

