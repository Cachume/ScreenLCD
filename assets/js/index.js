const minutos_span = document.getElementById("lcd-minutes")
const arrow_right = document.getElementById("button-right")
const arrow_left = document.getElementById("button-left")
arrow_right.addEventListener("click",function(){
    var value = minutos_span.textContent.split(":")
    var minutos = parseInt(value[0])>= 95 ? 0 : parseInt(value[0])+5
    
    minutos_span.innerText = ""
    minutos_span.innerText = minutos < 10 ? '0'+ minutos+ ":00": minutos + ":00"
    console.log()
})
arrow_left.addEventListener("click",function(){
    var value = minutos_span.textContent.split(":")
    var minutos = parseInt(value[0])<= 0 ? 95: parseInt(value[0])-5
    
    minutos_span.innerText = ""
    minutos_span.innerText = minutos < 10 ? '0'+ minutos+ ":00": minutos + ":00"
    console.log()
})