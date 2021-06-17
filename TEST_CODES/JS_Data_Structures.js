const arr = [14, 29, 1, 83];

const reducer = (accumulator, currVal) => {
	console.log(accumulator);
	console.log(currVal)
	return accumulator + currVal;
}

const result = arr.reduce(reducer);

console.log('Result: ' + result)
