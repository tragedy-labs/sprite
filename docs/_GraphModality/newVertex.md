---

layout: default

title: newVertex

permalink: /GraphModality/newVertex.html

---

### _GraphModality&lt;V, E&gt;_.newVertex

#### Interface

(**typeName: *N*, transaction: *SpriteTransaction*, options: *ISpriteInsertRecordOptions***)

Insert a new vertex into the database.

#### Example

```ts
const db = new SpriteDatabase({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
  databaseName: 'aSpriteDatabase'
});

type VertexTypes = {
  aType: {
    aProperty: string
  }
}

type EdgeTypes = {
  aType: {
    aProperty: string
  }
}

const client = db.graphModality<VertexTypes, EdgeTypes>();

// inserts / record creation must be conducted within a transaction
client.transaction(async (trx)=>{
  // to create a vertex, a type must be created first
  await client.createType('aVertex', trx);
  const vertex = await client.newVertex('aVertex', trx, {
    aProperty: 'aValue',
  });
  console.log(vertex);
  // {
  //   '@rid': '#0:0',
  //   '@cat': 'v',
  //   '@type': 'aVertex',
  //   'aProperty': 'aValue'
  // }
});
```

