let i = 0;
let txt = 'DMhub changes the way you look at data ...';
let speed = 80;

$(document).ready(function a(){
    if (i < txt.length) {
        document.getElementById("demo").innerHTML += txt.charAt(i);
        i++;
        setTimeout(a,speed);
    }
});

$(':file').change(function() {
    let file = $('#id_docfile')[0].files[0].name;
    console.log("ffuck", file)
    document.getElementById("filechoosen").innerHTML = file
});

// var input = document.getElementById( 'id_docfile' );
// var infoArea = document.getElementById( 'filechoosen' );
// input.addEventListener( 'change', showFileName );
//
// function showFileName( event ) {
//   var input = event.srcElement;
//   var fileName = input.files[0].name;
//   infoArea.textContent = 'File name: ' + fileName;
// }