---

layout: default

title: createDatabase

permalink: /SpriteServer/createDatabase.html

---

### _SpriteServer_.createDatabase

#### Interface

(**databaseName: *string***)

Create a database

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function createDatabaseExample(databaseName: string) {
  try {
    const database = await server.createDatabase(databaseName);
    console.log(database.name);
    // 'aDatabase'
  } catch (error) {
    console.log(error);
    // handle error conditions
  }
}

createDatabaseExample('aDatabase');
```

