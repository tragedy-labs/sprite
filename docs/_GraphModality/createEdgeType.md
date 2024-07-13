---

layout: default

title: createEdgeType

permalink: /GraphModality/createEdgeType.html

---

### _GraphModality_.createEdgeType

#### Interface

(**typeName: *N*, options: *ISpriteCreateTypeOptions&lt;E, N&gt;***)

Create a new edge type.

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

async function createEdgeTypeExample() {
  try {
    const type = await client.createEdgeType('aType', trx);
    console.log(type.name);
    // 'aType'
  } catch (error) {
    // handle error conditions
    console.error(error);
  }
};

createEdgeTypeExample();
```

