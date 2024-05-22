
document.addEventListener('DOMContentLoaded', function () {

    var images = document.querySelectorAll('.images');
    var currentIndex = 0;
    var lenght =images.length

  
    function showCurrentImage() {
       
        for (var i = 0; i < lenght; i++) {
            if (i === currentIndex) {
           
                images[i].style.opacity = '1';
            } else {
                
                images[i].style.opacity = '0';
            }
        }
    }

 
    function nextImage() {
           currentIndex = (currentIndex + 1) % lenght;
        showCurrentImage();
    }


    showCurrentImage();


    setInterval(nextImage, 9000);/*9 seconds */
});

let currentDate= new Date();
currentDate.toLocaleDateString();
let inputDate= document.getElementById("CheckInDate");



function Validate(){
    if(inputDate<currentDate){
        console.log("The input date is in past ")
    }

}






