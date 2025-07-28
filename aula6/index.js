function somar(){
    var numberone = window.document.getElementById('txtone');

    var numbertwo = window.document.getElementById('txttwo');

    var res = window.document.getElementById('res');


    var n1 = Number(numberone.value);
    var n2 = Number(numbertwo.value);
    var resultado = n1 + n2

    res.innerHTML = ' Resultado: '+ resultado;
    res1.innerHTML = `A soma entre ${n1} + ${n2} é igual a <strong>${resultado}<strong>`;
}