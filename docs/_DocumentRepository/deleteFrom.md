---

layout: default

title: deleteFrom

permalink: /DocumentRepository/deleteFrom.html

---

### _DocumentRepository&lt;S&gt;_.deleteFrom

#### Interface

(**typeName: *N*, transaction: *SpriteTransaction*, options: *ISpriteDeleteFromOptions&lt;S, N, P&gt;***)

Delete records of a certain type, target specific records
using the `where` property of the options argument.

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

async function deleteFromExample() {
  try {
    await client.transaction(async (trx) => {
      const result = await client.deleteFrom('aType', trx, {
        where: ['aField', '!=', 'aValue']
      });
      console.log(result);
      // returns the number of records deleted
      // as a result of the operation
      // { count: x }
    });
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

deleteFromExample();
```

