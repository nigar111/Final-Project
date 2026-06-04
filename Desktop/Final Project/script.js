const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const cocktailContainer = document.getElementById('cocktailContainer');


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
        
        const randomDrinks = responses
            .map(responseData => responseData.drinks ? responseData.drinks[0] : null)
            .filter(drinkItem => drinkItem !== null); 
        
        renderDrinks(randomDrinks);
        
    } catch (fetchError) {
        console.error("Failed to load cocktails:", fetchError);
        cocktailContainer.innerHTML = '<p style="text-align:center; width:100%;">Məlumatlar yüklənə bilmədi.</p>';
    }
}

