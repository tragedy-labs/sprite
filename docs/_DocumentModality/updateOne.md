---

layout: default

title: updateOne

permalink: /DocumentModality/updateOne.html

---

### _DocumentModality&lt;S&gt;_.updateOne

#### Interface

(**rid: *string*, data: *OmitMeta*, transaction: *SpriteTransaction***)

Update one record in the database, by providing an RID.

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

const client = database.documentModality<DocTypes>();

async function updateOneExample() {
  try {
    await client.transaction(async (trx) => {
      const result = await client.updateOne(
        '#0:0',
        { aField: 'aValue' },
        trx
      );
      console.log(result);
      // {
      //   '@rid': '#0:0',
      //   '@type': 'aType',
      //   '@cat': 'd',
      //   aField: 'aValue'
      // }
    });
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
};

updateOneExample();
```

