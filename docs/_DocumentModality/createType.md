---

layout: default

title: createType

permalink: /DocumentModality/createType.html

---

### _DocumentModality_.createType

#### Interface

(**typeName: *N*, options: *ISpriteCreateTypeOptions&lt;S, N&gt;***)

Create a new document type in the schema.

##### Note

---

non-idempotent commands (such a creating types) must be issued as part of a transaction

---

#### Example

```ts
const database = new Database({
  username: 'root',
  password: 'rootPassword',
  address: 'http://localhost:2480',
  databaseName: 'aDatabase'
});

interface DocumentTypes {
  aDocument: {
    aProperty: string
  }
}

const client = database.documentModality<DocumentTypes>();

async function createDocumentTypeExample() {
  try {
    const type = await client.createType('aDocument');
    console.log(type.name);
    // 'aType'
  } catch (error) {
    // handle error conditions
    console.error(error);
  }
};

createDocumentTypeExample();
```

