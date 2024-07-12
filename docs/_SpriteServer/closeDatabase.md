---

layout: default

title: closeDatabase

permalink: /SpriteServer/closeDatabase.html

---

### _SpriteServer_.closeDatabase

#### Interface

(**databaseName: *string***)

When you close a database in ArcadeDB, it:
1. Frees up resources on the server: The database instance is released, and the associated resources, such as memory, threads, and file handles, are returned to the system. This helps to reduce the server's memory footprint and free up resources for other tasks.
2. Releases it from RAM: The database instance is removed from the server's RAM, which means that the database's metadata, schema, and cached data are no longer stored in memory. This helps to reduce memory usage.
3. Prevents further operations: Once the database is closed, users can no longer perform operations on the database, such as executing queries, creating new records, or modifying existing data. The database is effectively "offline" until it's reopened.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function closeDatabaseExample(databaseName: string) {
  try {
    const closed = await server.closeDatabase(databaseName);
    console.log(closed);
    // true
  } catch (error) {
    // manage error conditions
    console.error(error);
  }
};

closeDatabaseExample('aDatabase');
```

