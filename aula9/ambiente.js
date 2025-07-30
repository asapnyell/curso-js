let numeros = [5,8,2,9,3]

console.log(`Nosso vetor é o [${numeros}].`)

numeros[5] = 10
//numeros.push(10)

console.log(`Nosso novo vetor é esse: [${numeros}]`)

numeros.push(50)

numeros.sort((a,b)=>a-b) // Ordena o vetor
console.log(`Nosso novo vetor é esse: [${numeros}]`)

console.log(`O vetor tem ${numeros.length} elementos`)