---

layout: default

title: exists

permalink: /SpriteDatabase/exists.html

---

### _SpriteDatabase_.exists

Check to see if this database exists on the server
(i.e. the database was created).

#### Example

```ts
async function databaseExistsExample() {
  try {
    const exists = await db.exists();
    console.log(exists);
    // true
  } catch (error) {
    console.error(error);
    // handle error conditions
  }
}

databaseExistsExample();
```

