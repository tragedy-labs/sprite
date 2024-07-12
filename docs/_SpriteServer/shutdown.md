---

layout: default

title: shutdown

permalink: /SpriteServer/shutdown.html

---

### _SpriteServer_.shutdown

Gracefully shutdown the server.\
`TODO:` This works, in that it does shutdown the server, but the fetch throws
before it resolves, guessing because the server is shutting down. A CURL, however,
returns an empty `204` response as the documentation indicates.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function shutdownExample() {
  try {
    const shutdown = await server.shutdown();
    console.log(shutdown);
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

shutdownExample();
```

