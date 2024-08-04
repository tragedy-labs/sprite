---

layout: default

title: createVertexType

permalink: /GraphRepository/createVertexType.html

---

### _GraphRepository&lt;V, E&gt;_.createVertexType

#### Interface

(**typeName: *N*, options: *ISpriteCreateTypeOptions&lt;V, N&gt;***)

Create a new vertex type.

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

const client = db.graphRepository<VertexTypes, EdgeTypes>();

async function createVertexTypeExample() {
  try {
    const type = await client.createVertexType('aType', trx);
    console.log(type.name);
    // 'aType'
  } catch (error) {
    // handle error conditions
    console.error(error);
  }
};

createVertexTypeExample();
```

