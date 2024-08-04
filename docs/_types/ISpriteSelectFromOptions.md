---

layout: default

title: ISpriteSelectFromOptions

permalink: /types/ISpriteSelectFromOptions.html

---

### ISpriteSelectFromOptions<br/><S, N, P>

Options for a `selectFrom` operation, as executed via a `SpriteDatabase` repository.

#### Definition

<h5> limit?: <span>number</span></h5>Defines the maximum number of records in the result-set. You may find this useful in
Pagination, when using it in conjunction with the `skip` option.


---

<h5> orderBy?: <span></span></h5>Designates the field with which to order the result-set.
Use the optional 'ASC' and 'DESC' operators to define the direction of the order.


---

<h5> skip?: <span>number</span></h5>Defines the number of records you want to skip from the start of the result-set.
You mayfind this useful in Pagination, when using it in conjunction with the
limit `option`.


---

<h5> timeout?: <span></span></h5>Defines the maximum time in milliseconds for the query, and optionally the
exception strategy to use.


---

<h5> where?: <span></span></h5>Designates conditions to filter the result-set.


