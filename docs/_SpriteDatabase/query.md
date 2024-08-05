---

layout: default

title: query

permalink: /SpriteDatabase/query.html

---

### _SpriteDatabase_.query

#### Interface

(**language: *ArcadeSupportedQueryLanguages*, command: *string*, parameters: *ArcadeQueryParameters***)

Executes a query against the target database. This method only executes
idempotent statements (that cannot change the database), namely `SELECT`
and `MATCH`.

**The execution of non-idempotent commands will throw an
`IllegalArgumentException` exception.**

If you are trying to execute
non-idempotent commands, see the SpriteDatabase.query method.

##### Note

---

This library includes type definitions to assist in writing queries with
typed return values. For example: `ArcadeDocument`, `ArcadeEdge`, etc.
You can use these like so:

```ts
const result = await db.query<ArcadeDocument<DocumentType>>(
 'sql',
 'SELECT * FROM aType WHERE aProperty == "aValue"'
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

type DocumentType = {
  aProperty: string
}

async function spriteQueryExample() {
  try {
    const result = await db.query<ArcadeDocument<DocumentType>>(
      'sql',
      'SELECT * FROM DocumentType WHERE aProperty == "aValue"'
    );
    console.log(result);
    // [{
    //   '@rid': '#0:0',
    //   '@cat': 'd',
    //   '@type': 'DocumentType',
    //   aProperty: 'aValue'
    // }];
    return result
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

spriteQueryExample();
```

