function verificar(){
    var data = new Date();
    var ano = data.getFullYear();
    var anons = document.getElementById('anonascimento');

    // As duas formas abaixo é possivel pegar a DIV com id RES .
    var res = document.getElementById('res');

    var resultado = document.querySelector('div#res');

    if(anons.value <= 0 || anons.value.length < 4 || anons.value > ano ){
        window.alert('[[ERROR]] VERIFIQUE OS DADOS E TENTE NOVAMENTE!');
    }else{
        var sex = document.getElementsByName('radsex');
        var idade = ano - anons.value;
        
        var genero = ''
        var img = document.createElement('img')
        img.setAttribute('id', 'foto') // aqui criei oque seria feito no html, 1 img com id foto.
        if(sex[0].checked){
            genero = 'Homem'
            if(idade>=0 && idade < 10){
                //criança
                img.setAttribute('src', '/ex014/assets/bebem.jpg')
            }else if(idade < 21){
                // JOVEM
                img.setAttribute('src', '/ex014/assets/jovemh.jpg')
            }else if(idade < 50){
                // Adulto
                img.setAttribute('src', '/ex014/assets/jovemh.jpg')
            }else{
                // Idoso
                img.setAttribute('src', '/ex014/assets/idoso.jpg')
            }
        }else if(sex[1].checked){
            genero = 'Mulher'
            if(idade>=0 && idade < 10){
                //criança
                img.setAttribute('src', '/ex014/assets/bebeh.jpg')
            }else if(idade < 21){
                // JOVEM
                img.setAttribute('src', '/ex014/assets/jovemm.jpg')
            }else if(idade < 50){
                // Adulto
                img.setAttribute('src', '/ex014/assets/jovemm.jpg')
            }else{
                // Idoso
                img.setAttribute('src', '/ex014/assets/idosa.jpg')
            }
        }
        resultado.style.textAlign = 'center'
        resultado.innerHTML = `${genero} com idade ${idade} anos`

        resultado.appendChild(img)

        //res.innerHTML = `Idade Calculada: ${idade} anos`;
    }
}