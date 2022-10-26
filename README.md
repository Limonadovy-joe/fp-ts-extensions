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

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Lib implementation</th>
      <th>own implementation - variant 1</th>
      <th>own implementation - variant 2</th>
      <th>own implementation - variant 3</th>
      <th>own implementation - variant 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
<td>
  
```ts
U.deepStrictEqual(clampNumber(1, 10)(2), 2)
U.deepStrictEqual(clampNumber(1, 10)(10), 10)
U.deepStrictEqual(clampNumber(1, 10)(20), 10)
U.deepStrictEqual(clampNumber(1, 10)(1), 1)
U.deepStrictEqual(clampNumber(1, 10)(-10), 1)
```
  
</td>
<td>
        
```ts
export const clamp = <A>(O: Ord<A>): ((low: A, hi: A) => (a: A) => A) => {
  const minO = min(O)
  const maxO = max(O)
  return (low, hi) => (a) => maxO(minO(a, hi), low)
}
```
        
</td>        
<td>
          
```ts          
const clamp2 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
  const min = Ord.min(ord);
  const max = Ord.max(ord);

  return (low, hig) => (val) => {
    const lowLimit = min(val, low);
    const highLimit = max(val, hig);

    return val === lowLimit ? low : val === highLimit ? hig : val;
      };
```          

TODO:
- [ ] Decompose the complicated parts of the ternary operator into seperate methods
  
</td>
<td>
          
```ts          
const clamp2 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
      const isValueUnderLimit = Ord.lt(ord);
      const isValueOverLimit = Ord.gt(ord);

      return (low, hig) => (val) => {
        let res = val;

        if (isValueUnderLimit(val, low)) res = low;
        if (isValueOverLimit(val, hig)) res = hig;

        return res;
      };
    };
```          

TODO:
- [x] Decompose the complicated parts of the ternary operator into seperate methods
- [ ] Consolidate conditional expression - consolidate all these conditionals into a single expression
  
</td>
<td>
          
```ts          
const clamp2 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
      const isValueUnderLimit = Ord.lt(ord);
      const isValueOverLimit = Ord.gt(ord);

      // @ts-ignore
      return (low, hig) => (val) => {
        if (!isValueUnderLimit(val, low) && !isValueOverLimit(val, hig)) return val;
        if (isValueUnderLimit(val, low)) return low;
        if (isValueOverLimit(val, hig)) return hig;
      };
    };
```          

TODO:
- [x] Decompose the complicated parts of the ternary operator into seperate methods
- [ ] Consolidate conditional expression - consolidate all these conditionals into a single expression
  
</td>

<td>
          
```ts          
const clamp2 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
      const hightLimit = Ord.min(ord);
      const lowLimit = Ord.max(ord);
      const isOverLimit = Ord.gt(ord);

      return (low, hig) => (val) => isOverLimit(val, hig) ? hightLimit(val, hig) : lowLimit(val, low);
    };
```          

TODO:
- [x] Decompose the complicated parts of the ternary operator into seperate methods
- [x] Consolidate conditional expression - consolidate all these conditionals into a single expression
  
</td>
</tr>
    <tr>
      <td colspan="6"><b>Performance test:</b></br>
Own implementation - ord.clamp - variant 1 x 610,920,690 ops/sec ±0.81% (85 runs sampled)</br>
own implementation - ord.clamp - variant 2 x 615,919,763 ops/sec ±0.86% (90 runs sampled)</br>
own implementation - ord.clamp - variant 3 x 607,484,169 ops/sec ±1.01% (86 runs sampled)</br>
own implementation - ord.clamp - variant 4 x 174,273,575 ops/sec ±1.22% (88 runs sampled)</br>
lib implementation - ord.clamp x 624,989,847 ops/sec ±0.70% (89 runs sampled)</br>
The fastest option is lib implementation - ord.clamp
      </td>  
    </tr>
  </tbody>
</table>


