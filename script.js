document.addEventListener('DOMContentLoaded', function () {
    var images = document.querySelectorAll('.images');
    var currentIndex = 0;
    var length = images.length;

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

    

    fetch('lodges.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');
            const lodges = xmlDoc.getElementsByTagName('lodge');

            for (let i = 0; i < lodges.length; i++) {
                const lodge = lodges[i];
                const id = i + 1;
                const image = lodge.getElementsByTagName('image')[0].textContent;
                const cost = lodge.getElementsByTagName('cost')[0].textContent;
                const umn = lodge.getElementsByTagName('umn')[0].textContent;
                const numberOfAdults = lodge.getElementsByTagName('numberOfAdults')[0].textContent;
                const numberOfChildren = lodge.getElementsByTagName('numberOfChildren')[0].textContent;

                const lodgeElement = document.getElementById(`Lodge${id}`);
                if (lodgeElement) {
                    lodgeElement.dataset.image = image;
                    lodgeElement.dataset.cost = cost;
                    lodgeElement.dataset.umn = umn;
                    lodgeElement.dataset.numberOfAdults = numberOfAdults;
                    lodgeElement.dataset.numberOfChildren = numberOfChildren;

                    lodgeElement.addEventListener('mouseenter', showTooltip);
                    lodgeElement.addEventListener('mouseleave', hideTooltip);
                }
            }
        })
        .catch(error => console.log('Error loading XML:', error));

    function showTooltip(event) {
        const tooltip = document.getElementById('tooltip');
        const lodgeElement = event.currentTarget;
        const image = lodgeElement.dataset.image;
        const cost = lodgeElement.dataset.cost;
        const umn = lodgeElement.dataset.umn;
        const numberOfAdults = lodgeElement.dataset.numberOfAdults;
        const numberOfChildren = lodgeElement.dataset.numberOfChildren;

        tooltip.innerHTML = `
            <strong>Image:</strong> ${image ? `<img src="${image}" alt="Lodge Image">` : 'No Image'}<br>
            <strong>Cost:</strong> $${cost}<br>
            <strong>Units:</strong> ${umn}<br>
            <strong>Adults:</strong> ${numberOfAdults}<br>
            <strong>Children:</strong> ${numberOfChildren}
        `;

        tooltip.style.display = 'block';
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY + 10 + 'px';
    }

    function hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    }

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.addEventListener('click', validate);

    function validate(event) {
        let currentDate = new Date();
        let checkInDate = new Date(document.getElementById("CheckInDate").value);
        let checkOutDate = new Date(document.getElementById("CheckOutDate").value);

        if (checkInDate < currentDate || checkOutDate <= checkInDate) {
            event.preventDefault();
            window.alert("Please select valid Check-in and Check-out dates.");
        }
    }
});
