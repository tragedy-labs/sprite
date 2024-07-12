---

layout: default

title: command

permalink: /SpriteDatabase/command.html

---

### _SpriteDatabase_.command

#### Interface

(**language: *ArcadeSupportedQueryLanguages*, command: *string*, transaction: *SpriteTransaction***)

Executes a command on the target database. This method should only be used
for non-idempotent statements (that can change the database), such as `INSERT`,
`CREATE`, and `DELETE`.

Commands to perform CRUD operations must have a transaction passed to them,
otherwise your changes will not be persisted. There is a method with a
non-optional transaction parameter, `SpriteDatabase.crud()`,
this is safer way to write your functionality.

If you are trying to execute idempotent commands see `SpriteDatabase.query()`.

##### Note

---

If the command you are issuing is sending JSON data, you must stringify the
data with `JSON.stringify()`.

```ts
db.command<InsertDocument<DocumentType>>(
  'sql',
  `INSERT INTO DocumentType CONTENT ${JSON.stringify({ aProperty: 'aValue' })}`,
  trx,
);
```

---

##### Note

---

This package includes type definitions to help you issue commands with typed return values.
For example: `CreateType`, `DeleteFrom`, `ArcadeDocument`, etc. You can use these
like so:

```ts
db.command<InsertDocument<DocumentType>>(
  'sql',
  'INSERT INTO DocumentType',
  trx
);
```

---

##### Note

---

Schema updates (i.e. `CREATE TYPE`, etc) are non-idempotent, but are also non-transactional.
Therefore, transactions are optional on this method.

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

