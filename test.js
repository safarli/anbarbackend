
const strobj = "Bendali    ";

const serializedstr = JSON.stringify(strobj);

const deserializedstr = JSON.parse(serializedstr);

console.log(strobj === deserializedstr);