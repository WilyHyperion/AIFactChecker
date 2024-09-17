let output = await Bun.file('output.json').json()
let used = [] as string[]
let final = []
for(let row of output) {
  if(used.includes(row.statement)) {
    continue
  }
  else {
    used.push(row.statement)
    final.push(row)
  }
}

let totalright = 0
for (const row of output) {
  if (row.ai == row.real){
    totalright++
  }
}
console.log(totalright + ' out of ' + output.length + ' right')
console.log('Repeat accounted for: ' +  (output.length - final.length) + ' out of ' + output.length)
console.log('Percentage: ' + (totalright / output.length) * 100 + '%') 
let newright = 0
for (const row of final) {
  if (row.ai == row.real){
    newright++
  }
}
console.log(newright + ' out of ' + final.length + ' right')
console.log('Percentage: ' + (newright / final.length) * 100 + '%')  // Output the percentage of correct predictions for the final array