---

layout: default

title: command

permalink: /SpriteServer/command.html

---

### _SpriteServer_.command

#### Interface

(**command: *string***)

Sends a command to the ArcadeDB server and returns the response.

This method provides a way to execute arbitrary commands on the server, such as creating databases, executing queries, or performing administrative tasks.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function commandExample(databaseName: string) {
  try {
    const response = await server.command(`CREATE DATABASE ${databaseName}`);
    console.log(response);
    // {
    //   user: 'aUser',
    //   version: '24.x.x',
    //   serverName: 'ArcadeDB_0',
    //   result: 'ok'
    // }
  } catch (error) {
    // Will throw an error for conditions such as:
    // Invalid credentials, Database Already Exists, etc.
    console.error(error);
    // {
    //   message: 'Encountered an error when sending a command to the server.',
    //   cause: Error: Invalid credentials
    // }
  }
}

commandExample('aDatabase');
```

