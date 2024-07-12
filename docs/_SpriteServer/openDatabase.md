---

layout: default

title: openDatabase

permalink: /SpriteServer/openDatabase.html

---

### _SpriteServer_.openDatabase

#### Interface

(**databaseName: *string***)

When you "open" a database in ArcadeDB, it means you're creating an instance of the database in memory, allocating resources, and making the database available for operations. Here's what happens when you open a database:

1. Create a new database instance: A new database instance is created in memory, which includes the database's metadata, schema, and cached data. This instance is used to manage the database's resources and provide access to the data.
2. Allocate resources: The database instance allocates the necessary resources, such as memory, threads, and file handles, to support the database's operations. This ensures that the database has the necessary resources to handle incoming requests.
3. Load database metadata and schema: The database's metadata and schema are loaded into memory, which includes information about the database's structure, indexes, and relationships.
4. Connect to the underlying storage: The database instance establishes a connection to the underlying storage, such as disk storage, to access the database files.
5. Make the database available for operations: The database is now available for users to perform operations, such as executing queries, creating new records, or modifying existing data.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function openDatabaseExample(databaseName: string) {
  try {
    const open = await server.openDatabase(databaseName);
    console.log(open);
    // true
  } catch (error) {
    // handle errors
    console.error(error);
  }
};

openDatabaseExample('aDatabase');
```

