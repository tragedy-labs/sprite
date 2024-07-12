---

layout: default

title: createUser

permalink: /SpriteServer/createUser.html

---

### _SpriteServer_.createUser

#### Interface

(**params: *ISpriteCreateArcadeUser***)

Create a user. `username`, `password`, and access controls to multiple databases
can be established using the `databases` property of the input parameters.
The `databases` object uses 'groups' to grant access controls. Assigning
a user to groups within a specific database grants them the permissions associated
with those groups for a particular database.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function createUserExample(details: ISpriteCreateArcadeUser) {
  try {
    const created = await server.createUser(details);
    console.log(created);
    // true
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
}

createUserExample({
  username: 'myUsername',
  password: 'myPassword',
  databases: {
    "FirstDatabase": "admin"
    "SecondDatabase": "user"
  }
});
```

