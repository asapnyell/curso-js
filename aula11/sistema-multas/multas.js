function calcular(){
    var txtvel = window.document.getElementById('txtvel');
     var res = window.document.getElementById('res');
    var velocidade = Number(txtvel.value);

    res.innerHTML = `<p>Sua velocidade atual é de <strong>${velocidade} Km/h</strong></p>`

    if(velocidade > 60){
        res.innerHTML += `<p>Velocidade acima do permitido. MULTADO!</p>`
    }

    res.innerHTML += `<p>Dirija sempre com cinto de segurança</p>`
}