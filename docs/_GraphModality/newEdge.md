---

layout: default

title: newEdge

permalink: /GraphModality/newEdge.html

---

### _GraphModality&lt;V, E&gt;_.newEdge

#### Interface

(**typeName: *N*, to: *SpriteEdgeVertexDescriptor&lt;V, V1&gt;*, from: *SpriteEdgeVertexDescriptor&lt;V, V2&gt;*, transaction: *SpriteTransaction*, options: *ISpriteEdgeOptions***)

Insert a new edge into the database.

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
client.transaction(async ()=>{
  // to create a edge, a type must be created first
  await client.createType('anEdge');
  const edge = await client.newEdge('anEdge', '#0:0', "#1:0", {
    aProperty: 'aValue',
  });
  console.log(edge.data);
  // {
  //   '@rid': '#3:0',
  //   '@cat': 'e',
  //   '@type': 'anEdge',
  //   '@in': '#0:0',
  //   '@out': '#1:0',
  //   aProperty: 'aValue'
  // }
});
```

