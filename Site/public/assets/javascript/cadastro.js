
var myBtnSignIn = document.getElementById("btn-sign-in"),
    myBtnSignUp = document.getElementById("btn-sign-up"),
    myContainer = document.getElementById("container"),
    mybtnforgetpass = document.getElementById("btn-forget-password") ;

window.onload =  function(){
    this.myBtnSignIn.click() ;    
    this.myOrangeTheme.click() ;
}


myBtnSignIn.onclick = function() {
    myBtnSignIn.style.backgroundColor="orange" ;
    myBtnSignUp.style.backgroundColor="rgba(255,255,255,0.2)" ;
    myContainer.style.transform="translateX(0px)"
}


myBtnSignUp.onclick = function() {
    myBtnSignUp.style.backgroundColor="orange" ;
    myBtnSignIn.style.backgroundColor="rgba(255,255,255,0.2)" ;
    myContainer.style.transform="translateX(-320px)"
}

mybtnforgetpass.onclick = function(){
    myBtnSignIn.style.backgroundColor="rgba(255,255,255,0.2)" ;
    myContainer.style.transform="translateX(320px)"    
}


