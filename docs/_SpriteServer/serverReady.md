---

layout: default

title: serverReady

permalink: /SpriteServer/serverReady.html

---

### _SpriteServer_.serverReady

Returns a `boolean` value indicating if the ArcadeDB server is ready.\
Useful for remote monitoring of server readiness.

#### Example

```ts
const client = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function serverReadyExample() {
  try {
    const ready = await client.serverReady();
    if (ready) {
      console.log(ready);
      // true;
    }
  } catch (error) {
    throw new Error(
      'An error occurred while running example.',
      { cause: error }
    );
  }
}

serverReadyExample();
```

