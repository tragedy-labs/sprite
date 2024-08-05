---

layout: default

title: create

permalink: /SpriteDatabase/create.html

---

### _SpriteDatabase_.create

Create a new database on the server.

#### Example

```ts
async function createDatabaseExample() {
  try {
    const exists = await db.exits();
    if (!exits) {
      const created = await db.create();
      console.log(created);
      // true
    }
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
}

createDatabaseExample();
```

