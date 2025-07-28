function buscar (){

var ps = window.document.getElementById('ps');
var resposta = window.document.getElementById('res');
var pais = ps.value.trim().toLowerCase(); // remove espaços e padroniza minúsculo

resposta.innerHTML = `Vivendo em ${pais}`

if(pais === 'brasil'){
   resposta.innerHTML += `<p>Voce é brasileiro</p>`
}else{
resposta.innerHTML += `<p>Voce é estrangeiro</p>`
}

}