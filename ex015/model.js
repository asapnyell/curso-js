function contar(){
var inicial =  Number(document.getElementById('inicial').value);
var final =  Number(document.getElementById('final').value);
var passo = Number(document.getElementById('pass').value);

var contagem = document.getElementById('contagem');



if (inicial == 0 || final == 0 || passo == 0){
    window.alert('Preencha todos os campos');
}else if (inicial < final && passo > 0){
    contagem.innerHTML = `Contando de ${inicial} até ${final} de ${passo} em ${passo}: <br>`;
    for (var c = inicial; c <= final; c += passo){
        contagem.innerHTML += `${c} \u{1F449} `;
    }
    contagem.innerHTML += `\u{1F3C1}`;
}else if (inicial > final && passo > 0){
    contagem.innerHTML = `Contando de ${inicial} até ${final} de ${passo} em ${passo}: <br>`;
    for (var c = inicial; c >= final; c -= passo){
        contagem.innerHTML += `${c} \u{1F449} `;
    }
    contagem.innerHTML += `\u{1F3C1}`;
}else if (inicial < final && passo < 0){
    contagem.innerHTML = `Contando de ${inicial} até ${final} de ${passo} em ${passo}: <br>`;
    for (var c = inicial; c <= final; c -= passo){
        contagem.innerHTML += `${c} \u{1F449} `;
    }
    contagem.innerHTML += `\u{1F3C1}`;
}else if (inicial > final && passo < 0){
    contagem.innerHTML = `Contando de ${inicial} até ${final} de ${passo} em ${passo}: <br>`;
    for (var c = inicial; c >= final; c += passo){
        contagem.innerHTML += `${c} \u{1F449} `;
    }
    contagem.innerHTML += `\u{1F3C1}`;
}else{
    contagem.innerHTML = 'Impossível contar';

// contagem.innerHTML = 'Ola';

}
}


// console.log(contar());