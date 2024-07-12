---

layout: default

title: databaseExists

permalink: /SpriteServer/databaseExists.html

---

### _SpriteServer_.databaseExists

#### Interface

(**databaseName: *string***)

Check to see if a database exists.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function databaseExistsExample(databaseName: string) {
  try {
    await server.createDatabase(databaseName);
    const exists = await server.databaseExists(databaseName);
    console.log(exists);
    // true
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

databaseExistsExample('aDatabase');
```

