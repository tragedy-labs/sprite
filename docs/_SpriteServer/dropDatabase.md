---

layout: default

title: dropDatabase

permalink: /SpriteServer/dropDatabase.html

---

### _SpriteServer_.dropDatabase

#### Interface

(**databaseName: *string***)

Drop a database

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function dropDatabaseExample(databaseName: string) {
  try {
    const dropped = await server.dropDatabase(databaseName);
    console.log(dropped);
    // true
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

dropDatabaseExample('aDatabase');
```

