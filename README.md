**Type classes**:

- [**Ord**](#ord)
  - [Definition](#definition-of-ord-type-class)
  - [Math laws](#math-laws-of-ord-type-class)
  - [Examples](#examples-of-ord-type-class)
  - [Quiz](#quiz-of-Ord)
  - [Methods](#methods-of-ord-type-class)
    - [tuple](#ord-tuple)
      - [lib implementation](#ord-tuple-lib)
      - [own implementation](#ord-tuple-own)
      - [note](#tuple-note)
      
      
   
# **Ord**

## Definition

## Math laws

## Examples

## Quiz

## Methods

### tuple
Signature:
```ts
export declare const tuple: <A extends readonly unknown[]>(...ords: { [K in keyof A]: Ord<A[K]> }) => Ord<Readonly<A>>
```
Performance test:<br> 
own - ord.tuple x 6,534,276 ops/sec ±1.02% (89 runs sampled)<br>
lib - ord.tuple x 65,768,421 ops/sec ±0.94% (89 runs sampled)<br>
The fastest option is lib - ord.tuple

#### lib implementation
```ts
export const tuple = <A extends ReadonlyArray<unknown>>(...ords: { [K in keyof A]: Ord<A[K]> }): Ord<Readonly<A>> =>
  fromCompare((first, second) => {
    let i = 0
    for (; i < ords.length - 1; i++) {
      const r = ords[i].compare(first[i], second[i])
      if (r !== 0) {
        return r
      }
    }
    return ords[i].compare(first[i], second[i])
  })
```
#### own implementation
**Note**: Set default value to zero to ensure neutral relation between tuples.  x < y ---> -1 , x > y ---> 1
```ts
export const tuple = <A extends ReadonlyArray<unknown>>(...ords: { [K in keyof A]: Ord<A[K]> }): Ord<Readonly<A>> => ({
  compare: (tupleA, tupleB) =>
    ords.reduce<Ordering>((acc, ord, index) => ord.compare(tupleA[index], tupleB[index]) || acc, 0),
  equals: (tupleA, tupleB) => ords.every(({ compare }, index) => compare(tupleA[index], tupleB[index]) === 0)
});
```
   
   
  
