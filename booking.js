document.addEventListener('DOMContentLoaded', function () {

  
    var images = document.querySelectorAll('.images');
    var currentIndex = 0;
    var length = images.length;
    var lodgesData = {};
    var bookedLodges = {}; 
    var selectedLodge = null;

    var sCheckin= document.getElementById("summary-checkin");
    var sCheckout= document.getElementById("summary-checkout");
    var sNumberOfPeople = document.getElementById("summary-numberofpeople");
    var sLodge = document.getElementById("summary-lodge");
    var sPrice = document.getElementById("summary-price");

    function showCurrentImage() {
        for (var i = 0; i < length; i++) {
            images[i].style.opacity = (i === currentIndex) ? '1' : '0';
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % length;
        showCurrentImage();
    }

    showCurrentImage();
    setInterval(nextImage, 9000);

    function loadXMLData() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'lodges.xml', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xhr.responseText, 'application/xml');
                var lodges = xmlDoc.getElementsByTagName('lodge');

                for (var i = 0; i < lodges.length; i++) {
                    var lodge = lodges[i];
                    var id = i + 1;
                    var image = lodge.getElementsByTagName('image')[0].textContent;
                    var cost = lodge.getElementsByTagName('cost')[0].textContent;
                    var umn = lodge.getElementsByTagName('umn')[0].textContent;
                    var booked = lodge.getElementsByTagName('booked')[0].textContent;

                    var lodgeElement = document.getElementById('Lodge' + id);
                    lodgesData['Lodge' + id] = { image, cost, umn, booked };
                    bookedLodges[id] = booked === 'true'; // Store the booked status

                    if (lodgeElement) {
                        lodgeElement.dataset.image = image;
                        lodgeElement.dataset.cost = cost;
                        lodgeElement.dataset.umn = umn;
                        lodgeElement.dataset.booked = booked;

                        if (lodgeElement.dataset.booked === 'true') {
                            lodgeElement.style.backgroundColor = '#A91D3A';
                            lodgeElement.style.cursor = 'not-allowed';
                        } else {
                            lodgeElement.addEventListener('click', selectLodge);
                        }

                        lodgeElement.addEventListener('mouseenter', showTooltip);
                        lodgeElement.addEventListener('mouseleave', hideTooltip);
                    }
                }
            }
        };

        xhr.send();
    }

    function showTooltip(event) {
        var tooltip = document.getElementById('tooltip');
        var lodgeElement = event.currentTarget;

        if (lodgeElement.dataset.booked === 'true') {
            tooltip.innerHTML = `
                <img src="${lodgeElement.dataset.image}" alt="Lodge Image" style="width:500px;height:auto;"><br>
                <strong>Cost:</strong> $${lodgeElement.dataset.cost} <strong>per night</strong> 
                <br>
                <strong>Maximum People:</strong> ${lodgeElement.dataset.umn}<br>
                <strong>This lodge is already booked.</strong>
            `;
        } else {
            tooltip.innerHTML = `
                <img src="${lodgeElement.dataset.image}" alt="Lodge Image" style="width:500px;height:auto;"><br>
                <strong>Cost:</strong> $${lodgeElement.dataset.cost} <strong>per night</strong> 
                <br>
                <strong>Maximum People:</strong> ${lodgeElement.dataset.umn}<br>
            `;
        }

        tooltip.style.display = 'block';
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY + 10 + 'px';
    }

    function hideTooltip() {
        var tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    }

    function selectLodge(event) {
        selectedLodge = event.currentTarget.id;
    }

    loadXMLData();

    var submitButton = document.querySelector('button[type="submit"]');
    submitButton.addEventListener('click', function (event) {
        var currentDate = new Date();
        var checkInDate = new Date(document.getElementById('CheckInDate').value);
        var checkOutDate = new Date(document.getElementById('CheckOutDate').value);

        if (checkInDate < currentDate || checkOutDate <= checkInDate) {
            event.preventDefault();
            alert('Please select valid Check-in and Check-out dates.');
        } else {
            var lodgeMap = document.getElementById('MapBox');
            lodgeMap.style.display = 'block';
        }
    });

    document.querySelector('button[type="submit"]').addEventListener('click', function (event) {
        event.preventDefault(); 
    
        var checkInDate = new Date(document.getElementById('CheckInDate').value);
        var checkOutDate = new Date(document.getElementById('CheckOutDate').value);
        var currentDate = new Date();
    
        if (checkInDate <= currentDate || checkOutDate <= checkInDate) {
            alert('Please select valid Check-in and Check-out dates.');
            return;
        }
    
        document.getElementById('MapBox').style.display = 'block';
    });

    function getFormData() {
        var summaryCheckin = document.getElementById("CheckInDate").value;
        var summaryCheckout = document.getElementById("CheckOutDate").value;
        var adults = document.getElementById("Adults").value;
        var children = document.getElementById("Children").value;
        var totalPeople = parseInt(adults) + parseInt(children);

        return {
            checkInDate: summaryCheckin,
            checkOutDate: summaryCheckout,
            numberOfPeople: totalPeople
        };
    }

    function updateSummary() {
        const data = getFormData();

        sCheckin.innerHTML = data.checkInDate;
        sCheckout.innerHTML = data.checkOutDate;
        sNumberOfPeople.innerHTML = data.numberOfPeople;
        sLodge.innerHTML = selectedLodge;
        
        var lodgeData = lodgesData[selectedLodge];
        var price = calculateTotalPrice(data.checkInDate, data.checkOutDate, lodgeData.cost);
        sPrice.innerHTML = '$' + price;
    }

    document.getElementById('select-button').addEventListener('click', function() {
        const lodgeNumber = document.getElementById('lodge-number-input').value;
        const checkInDate = document.getElementById('CheckInDate').value;
        const checkOutDate = document.getElementById('CheckOutDate').value;
        const numberOfAdults = document.getElementById('Adults').value;
        const numberOfChildren = document.getElementById('Children').value;

        selectedLodge = 'Lodge' + lodgeNumber;

        if (bookedLodges[lodgeNumber]) {
            alert('This lodge is already booked. Please select another lodge.');
            return;
        }

        document.getElementById('summary-checkin').innerText = checkInDate;
        document.getElementById('summary-checkout').innerText = checkOutDate;
        document.getElementById('summary-numberofpeople').innerText = `Adults: ${numberOfAdults}, Children: ${numberOfChildren}`;
        document.getElementById('summary-lodge').innerText = selectedLodge;

        const lodgeData = lodgesData[selectedLodge];
        const totalPrice = calculateTotalPrice(checkInDate, checkOutDate, lodgeData.cost);
        sPrice.innerText = '$' + totalPrice;

        document.getElementById('summaryData').style.display = 'block';
    });





   

    function calculateTotalPrice(checkInDate, checkOutDate, costPerNight) {
        var checkIn = new Date(checkInDate);
        var checkOut = new Date(checkOutDate);
        var timeDifference = checkOut.getTime() - checkIn.getTime();
        var days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return days * parseFloat(costPerNight);
    }
});


var confirmButton = document.getElementById('confirm');
confirmButton.addEventListener('click', function () {
    alert('Successfully booked!');
    window.location.reload();
    if (selectedLodge) {
        selectedLodge.style.backgroundColor = '#FF0000'; 
        selectedLodge.classList.add('booked');
        alert('Successfully booked!');
        window.location.reload();
    } else {
        alert('Please select a lodge before confirming.');
    }
});
