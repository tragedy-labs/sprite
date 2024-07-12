---

layout: default

title: dropUser

permalink: /SpriteServer/dropUser.html

---

### _SpriteServer_.dropUser

#### Interface

(**username: *string***)

Drop a user from the ArcadeDB server.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function dropUserExample(username: string) {
  try {
    const dropped = await server.dropUser(username);
    console.log(dropped);
    // true
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

dropUserExample('aUser');
```

