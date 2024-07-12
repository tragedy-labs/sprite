---

layout: default

title: ISpriteDeleteFromOptions

permalink: /types/ISpriteDeleteFromOptions.html

---

### ISpriteDeleteFromOptions<br/><S, N extends TypeNames&lt;S&gt;, P>

Options for a `deleteFrom` operation as executed
via a `SpriteDatabase` modality.

#### Definition

<h5> limit?: <span>number</span></h5>Defines the maximum number of records in the result-set.


---

<h5> return?: <span>BEFORE | COUNT</span></h5>Defines what is returned following the command: the count of the records before (`BEFORE`) or following deletion (`COUNT`).


---

<h5> timeout?: <span>number</span></h5>The duration of the timeout in milliseconds.


---

<h5> where: <span></span></h5>Designates conditions to filter the result-set.


