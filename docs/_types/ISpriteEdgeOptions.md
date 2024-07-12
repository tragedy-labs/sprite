---

layout: default

title: ISpriteEdgeOptions

permalink: /types/ISpriteEdgeOptions.html

---

### ISpriteEdgeOptions<br/><D>

Options associated with creating a new edge.

#### Definition

<h5> batchSize?: <span>number</span></h5>Defines whether it breaks the command down into smaller blocks and the size of
the batches. This helps to avoid memory issues when the number of vertices is
too high.


---

<h5> bucket?: <span>string</span></h5>The bucket to store the edge in.


---

<h5> data?: <span></span></h5>Data to populate the edge with.


---

<h5> ifNotExists?: <span>boolean</span></h5>When set to `true`, skips the creation of the edge in another edge already exists with the same
direction (same from/to) and same edge type, instead of throwing an error.


---

<h5> unidirectional?: <span>boolean</span></h5>Creates a unidirectional edge; by default edges are bidirectional


---

<h5> upsert?: <span>boolean</span></h5>Skip creation if the edge already exists between two vertices (i.e. the edge
must be unique between the vertices). This works only if the edge type has a
`UNIQUE` index on `from`/`to` fields, otherwise the creation fails.


