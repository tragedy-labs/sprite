---

layout: default

title: deleteOne

permalink: /GraphRepository/deleteOne.html

---

### _GraphRepository&lt;V, E&gt;_.deleteOne

#### Interface

(**rid: *string*, transaction: *SpriteTransaction***)

Delete a specific record by providing the `rid`

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

async function deleteOneExample() {
  try {
    await client.transaction(async (trx) => {
      const result = await client.deleteOne('#0:0', trx);
      console.log(result);
      // number of records deleted as a result
      // of the operation
      // { count: 1 }
    });
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

deleteOneExample();
```

