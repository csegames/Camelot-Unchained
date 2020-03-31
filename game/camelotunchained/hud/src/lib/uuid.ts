// Taken from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
// User broofa
export function generateUUIDv4() {
  const uuidString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  console.log(uuidString);
  return Number(uuidString);
}

console.log('@#%!@#$%!@#%!@#%!');
console.log(generateUUIDv4());
