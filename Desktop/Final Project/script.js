const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
const navMenu = document.querySelector('#navMenu');
const cocktailContainer = document.querySelector('#cocktailContainer');
const searchInput = document.querySelector('#searchInput'); 
const reservationForm = document.querySelector('#reservationForm'); 
const successMessage = document.querySelector('#successMessage'); 


let fetchedDrinks = []; 

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

async function fetchCocktails() {
    try {
        cocktailContainer.innerHTML = ''; 
        const fetchPromises = [];
        for (let i = 0; i < 12; i++) {
            fetchPromises.push(
                fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network error occurred.');
                        }
                        return response.json();
                    })
            );
        }
        
        const responses = await Promise.all(fetchPromises);
        
        fetchedDrinks = responses
            .map(responseData => responseData.drinks ? responseData.drinks[0] : null)
            .filter(drinkItem => drinkItem !== null); 
        
        renderDrinks(fetchedDrinks);
        
    } catch (fetchError) {
        console.error("Failed to load cocktails:", fetchError);
        cocktailContainer.innerHTML = '<p style="text-align:center; width:100%;">Məlumatlar yüklənə bilmədi.</p>';
    }
}


function renderDrinks(drinksArray) {
    cocktailContainer.innerHTML = ''; 
    

    if (drinksArray.length === 0) {
        cocktailContainer.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1 / -1; color: #7A746B; font-style: italic;">Axtarışınıza uyğun kokteyl tapılmadı.</p>';
        return;
    }

    
    const cardsHTML = drinksArray.map(drinkItem => {
        return `
            <div class="cocktail-card">
                <img src="${drinkItem.strDrinkThumb}" alt="${drinkItem.strDrink}">
                <h3>${drinkItem.strDrink}</h3>
                <p style="font-size: 0.85rem; color: #7A746B; font-style: italic;">${drinkItem.strCategory}</p>
            </div>
        `;
    }).join(''); 

    cocktailContainer.innerHTML = cardsHTML;
}


searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    

    const filteredDrinks = fetchedDrinks.filter(drink => 
        drink.strDrink.toLowerCase().includes(searchTerm)
    );
    
    renderDrinks(filteredDrinks);
});

reservationForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    

    const fullName = document.querySelector('#fullName').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
    const reservationDate = document.querySelector('#reservationDate').value;

    
    let currentReservations = JSON.parse(localStorage.getItem('allReservations')) || [];

    
    const newGuest = {
        name: fullName,
        phone: phoneNumber,
        date: reservationDate,
        createdAt: new Date().toLocaleString() 
    };

  
    currentReservations.push(newGuest);
    localStorage.setItem('allReservations', JSON.stringify(currentReservations));
    
   
    reservationForm.style.display = 'none';
    successMessage.classList.add('show');
    
    reservationForm.reset(); 
});

window.addEventListener('DOMContentLoaded', fetchCocktails);

const refreshDrinksBtn = document.querySelector('#refreshDrinksBtn');
refreshDrinksBtn.addEventListener('click', fetchCocktails);

function checkPoolStatus() {
    const statusElement = document.querySelector('#shopStatus');
    const currentHour = new Date().getHours(); 

   
    if (currentHour >= 10 && currentHour < 19) {
        statusElement.innerHTML = '🟢 Hazırda AÇIQDIR';
        statusElement.style.color = '#4CAF50'; 
    } else {
        statusElement.innerHTML = '🔴 Hazırda QAPALIDIR';
        statusElement.style.color = '#F44336'; 
    }
}
window.addEventListener('DOMContentLoaded', checkPoolStatus);

function initDynamicTemperature() {
    const fillElement = document.querySelector('#scaleFill');
    const valueElement = document.querySelector('#tempValue');

    const minTemp = 24;
    const maxTemp = 28;
    const randomTemperature = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;

  
    if (valueElement) {
        valueElement.innerHTML = randomTemperature + "°C";
    }


    const maxTemperature = 40; 
    const percentage = (randomTemperature / maxTemperature) * 100;

    setTimeout(() => {
        if (fillElement) {
            fillElement.style.width = percentage + '%';
        }
    }, 300);
}


window.addEventListener('DOMContentLoaded', initDynamicTemperature);
