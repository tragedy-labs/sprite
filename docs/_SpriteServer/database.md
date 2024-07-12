---

layout: default

title: database

permalink: /SpriteServer/database.html

---

### _SpriteServer_.database

#### Interface

(**databaseName: *string***)

Returns an `SpriteDatabase` instance for the supplied `databaseName`,
using the authorization details of the `SpriteServer` instance.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function databaseExample() {
  try {
    const database = await server.database('aDatabase');
    // returns an instance of SpriteDatabase
    console.log(database.name);
  } catch (error) {
    // handle errors
    console.error(error);
  }
};

databaseExample();
```

