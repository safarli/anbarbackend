

const regex_1 = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test('Salam123')
// const regex_1 = /^[0-9a-zA-Z]{8,}$/.test('3464123654')

console.log(regex_1)