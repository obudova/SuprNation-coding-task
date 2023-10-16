// Section A: Map Reduce

// 1. sumSquares
function sumSquares(a: number, b: number): number {
    return a > b ? 0 : a * a + sumSquares(a + 1, b);
}

// const result = sumSquares(1, 5);
// console.log(result);

// 2. sumCubes
function sumCubes(a: number, b: number): number {
    return a > b ? 0 : a * a * a + sumCubes(a + 1, b);
}

// const result = sumCubes(1, 5);
// console.log(result);

// 3. sumFactorials

// decoupled factorial into separate recursive function
function factorial(n: number): number {
    return n === 0 ? 1 : n * factorial(n - 1);
}

function sumFactorials(a: number, b: number): number {
    if (a > b) {
        return 0;
    }

    return factorial(a) + sumFactorials(a + 1, b);
}

// const result = sumFactorials(1, 5);
// console.log(result); // Output: 153

// 4. sumMap

function sumMap(mappingFunction: (x: number) => number) {
    return function (a: number, b: number): number {
        if (a > b) {
            return 0;
        }
        return mappingFunction(a) + sumMap(mappingFunction)(a + 1, b);
    };
}

// const sumInt = sumMap(x => x)(1, 5);
// console.log(test)
// const test2 = sumMap(x => x * x)(1, 5) // 55
// console.log(test2)

// 5. Refactor prev functions with sumMap:

const sumInt2 = sumMap((x) => x);
const sumSquares2 = sumMap((x) => x * x);
const sumCubes2 = sumMap((x) => x * x * x);
const sumFactorial2 = sumMap(factorial);

// console.log(sumFactorial2(1,5))

// 6. prodInts

function prodInts(a: number, b: number): number {
    return a > b ? 1 : a * prodInts(a + 1, b);
}

// 7. prodSquares
function prodSquares(a: number, b: number): number {
    return a > b ? 1 : a * a * prodSquares(a + 1, b);
}

// 8. prodCubes

function prodCubes(a: number, b: number): number {
    return a > b ? 1 : a * a * a * prodCubes(a + 1, b);
}

// 9. prodFactorial
function prodFactorial(a: number, b: number): number {
    return a > b ? 1 : factorial(a) * prodFactorial(a + 1, b);
}

// 10. prodMap
function prodMap(mappingFunction: (x: number) => number) {
    return function (a: number, b: number): number {
        if (a > b) {
            return 1;
        }
        return mappingFunction(a) * prodMap(mappingFunction)(a + 1, b);
    };
}

// const result1 = prodMap(x => x)(1, 5);
// console.log(result1); // Output: 120

// 11:

const prodInt2 = prodMap((x) => x);
const prodSquares2 = prodMap((x) => x * x);
const prodCubes2 = prodMap((x) => x * x * x);
const prodFactorial2 = prodMap(factorial);

// 12:

const mapReduce2 =
    (reduceFn: (first: number, second: number) => number, zero: number) =>
        (mapFn: (value: number) => number) =>
            (a: number, b: number) => {
                function loop(x: number, acc: number): number {
                    if (x > b) {
                        return acc;
                    }
                    return loop(x + 1, reduceFn(acc, mapFn(x)));
                }
                return loop(a, zero);
            };

const sumMap3 = mapReduce2((a, b) => a + b, 0)(x => x);
const prodMap3 = mapReduce2((a, b) => a * b, 1)(x => x);

// const result3 = sumMap3(1, 5);
// console.log(result1); // Output: 15

// const result4 = prodMap3(1, 5);
// console.log(result2); // Output: 120
