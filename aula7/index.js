var idade = 15
if(idade < 16){
    console.log('Nao vota')
} else if ( idade <18){
    console.log('Voto Opcional')
}else{
    console.log('Voto obrigatorio')
}

var agora = new Date();
var dia = agora.getDate();

console.log(`${dia}`)