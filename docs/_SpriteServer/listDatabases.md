---

layout: default

title: listDatabases

permalink: /SpriteServer/listDatabases.html

---

### _SpriteServer_.listDatabases

Returns a list of database names that are present on the server.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function listDatabasesExample() {
  try {
    const list = await sprite.listDatabases();
    console.log(list);
    // [ 'databaseName' ]
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

listDatabasesExample();
```

