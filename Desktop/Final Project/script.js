const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const cocktailContainer = document.getElementById('cocktailContainer');
const searchInput = document.getElementById('searchInput'); 
const reservationForm = document.getElementById('reservationForm'); 
const successMessage = document.getElementById('successMessage'); 


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
                fetch('https:www.thecocktaildb.com/api/json/v1/1/random.php')
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
    

    const fullName = document.getElementById('fullName').value;
    const userAge = document.getElementById('userAge').value;

   
    let currentReservations = JSON.parse(localStorage.getItem('allReservations')) || [];

   
    const newGuest = {
        name: fullName,
        age: userAge,
        date: new Date().toLocaleString()
    };

  
    currentReservations.push(newGuest);
    localStorage.setItem('allReservations', JSON.stringify(currentReservations));
    

    reservationForm.style.display = 'none';
    successMessage.classList.add('show');
    
    reservationForm.reset(); 
});

window.addEventListener('DOMContentLoaded', fetchCocktails);