---

layout: default

title: getEvents

permalink: /SpriteServer/getEvents.html

---

### _SpriteServer_.getEvents

Retrieves a list of server events, optionally a filename of the form
`server-event-log-yyyymmdd-HHMMSS.INDEX.jsonl` (where INDEX is a integer, i.e. 0)
can be given to retrieve older event logs.

#### Example

```ts
const server = new SpriteServer({
  username: 'aUser',
  password: 'aPassword',
  address: 'http://localhost:2480',
});

async function getServerEventsExample() {
  try {
    const events = await server.getServerEvents();
    console.log(events);
    // {
    //    events: [
    //      {
    //        "time":"2024-01-30 06:37:20.325",
    //        "type":"INFO","component":"Server",
    //        "message":"ArcadeDB Server started in \\u0027development\\u0027 mode (CPUs\\u003d8 MAXRAM\\u003d3.84GB)"}]
    //      }
    //    ],
    //    files: [
    //      "server-event-log-20240205-060106.13.jsonl",
    //      "server-event-log-20240204-185020.12.jsonl",
    //      "server-event-log-20240204-063235.11.jsonl",
    //      "server-event-log-20240131-205254.10.jsonl",
    //      "server-event-log-20240130-133802.9.jsonl"
    //    ]
    // }
  } catch (error) {
    console.error(error);
    // handle error condition
  }
}

getServerEventsExample();
```

