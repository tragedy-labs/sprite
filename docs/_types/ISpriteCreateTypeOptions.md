---

layout: default

title: ISpriteCreateTypeOptions

permalink: /types/ISpriteCreateTypeOptions.html

---

### ISpriteCreateTypeOptions<br/><S, N extends TypeNames&lt;S&gt;>

Options to create a new type with.

#### Definition

<h5> buckets?: <span> | </span></h5>A bucket-name, or an array of bucket-names you want this type to use.


---

<h5> extends?: <span></span></h5>Defines a super-type you want to extend with this type.


---

<h5> ifNotExists?: <span>boolean</span></h5>When set to true, the type creation will be ignored if the
type already exists (instead of failing with an error).


---

<h5> totalBuckets?: <span>number</span></h5>Defines the total number of buckets you want to create for this type. The


