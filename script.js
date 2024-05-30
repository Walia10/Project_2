
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

const submitButton = document.querySelector('button[type="submit"]');
submitButton.addEventListener('click', validate());


function validate(event) {
    let currentDate = new Date();
    let checkInDate = new Date(document.getElementById("CheckInDate").value);
    let checkOutDate = new Date(document.getElementById("CheckOutDate").value);

    if (checkInDate < currentDate || checkOutDate <= checkInDate) {
        event.preventDefault();
        window.prompt("Please select valid Check-in and Check-out dates.");
       
}
}








