function carregar() {
var msg = window.document.getElementById("msg");
var foto = window.document.getElementById("imagem");
var data = new Date();
var hora =  data.getHours();
msg.innerHTML = `Agora são ${hora} horas.`

if (hora >= 0 && hora < 12) {
    // Bom dia!
    foto.src = "/ex013/assets/manhaa.png";
    msg.innerHTML += "<p>Bom dia!</p>";
    document.body.style.background = "#e2cd9f";
}else if (hora >= 12 && hora <= 18) {
    // Boa tarde!
    foto.src = "/ex013/assets/tardee.png";
    msg.innerHTML += "<p>Boa tarde!</p>";
    document.body.style.background = "#b9846f";
}else {
    // Boa noite!
    foto.src = "/ex013/assets/noitee.png";
    document.body.style.background = "#515154";
    msg.innerHTML += "<p>Boa noite!</p>";

}
}