---

layout: default

title: constructor

permalink: /SpriteServer/constructor.html

---

### _SpriteServer_

#### Interface

(**parameters: *ISpriteRestClientConnectionParameters***)

Methods for interact with an ArcadeDB server. Manage databases, users, etc.

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

