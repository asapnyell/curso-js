let valores = [5,8,2,9,3,50,10]
valores.push(100)
console.log(`TAMANHO: ${valores.length}`)
console.log(valores)

for(position = 0;position<valores.length ;position++){
    console.log(`A posição ${position} tem o valor ${valores[position]}`)
}
console.log('---------------------------------')
console.log('OUTRA FORMA DE USAR LAÇO FOR ABAIXO')
console.log('---------------------------------')

for(let position in valores){
    console.log(`A posição ${position} tem o valor ${valores[position]}`)
}

valores.push(7)
valores.push(1)

console.log('---------------------------------')
valores.sort((a,b)=>a-b)
console.log('VETOR ORDENADO')
console.log('---------------------------------')

for(let position in valores){
    console.log(`A posição ${position} tem o valor ${valores[position]}`)
}

console.log('---------------------------------')
console.log('BUSCAR VALOR')
console.log('---------------------------------')

let pos = valores.indexOf(99) // Retorna o index do valor buscado, se existir retorna se nao retorna -1
if(pos == -1){
    console.log('VALOR NAO ENCONTRADO!')
}else{
    console.log(`O valor está na posição ${pos}`)
}

