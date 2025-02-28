document.getElementById("menu-button").addEventListener("click", function () {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("hidden");
});

const cardsContainer = document.getElementById("cards-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
    cardsContainer.scrollBy({ left: -300, behavior: "smooth" });
});

nextBtn.addEventListener("click", () => {
    cardsContainer.scrollBy({ left: 300, behavior: "smooth" });
});

async function fetchData() {
    try {
        const response = await fetch("inspire.json");
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Data:", data); 
        generateCards(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function getLikedItems() {
    return JSON.parse(localStorage.getItem("likedItems")) || [];
}

function toggleLike(id) {
    let likedItems = getLikedItems();
    if (likedItems.includes(id)) {
        likedItems = likedItems.filter(item => item !== id);
    } else {
        likedItems.push(id);
    }
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    fetchData(); 
}

function generateCards(travelData) {
    const container = document.getElementById("cards-container");
    container.innerHTML = "";
    const likedItems = getLikedItems();

    travelData.forEach(data => {
        const isLiked = likedItems.includes(data.id);
        const card = document.createElement("div");
        card.className = "bg-white rounded-3xl shadow-md overflow-hidden w-72 flex-shrink-0";
        card.innerHTML = `
            <div class="relative">
                <img src="${data.image}" alt="journey" class="w-full h-48 object-cover">
                <p class="bg-white rounded-full text-black absolute top-2 left-2 p-2 text-xs font-semibold">${data.category}</p>
                <button onclick="toggleLike(${data.id})" class="bg-white rounded-full p-2 absolute top-2 right-2">
                    <img src="images/${isLiked ? 'heartfilled.svg' : 'heart.svg'}" alt="heart">
                </button>
            </div>
            <div class="p-4">
                <div class="flex text-[10px] space-x-4 mb-2">
                    <p class="flex items-center"><img src="images/calen.svg" alt="calendar" class="mr-1">${data.date}</p>
                    <p class="flex items-center"><img src="images/clock.svg" alt="clock" class="mr-1">${data.duration}</p>
                    <p class="flex items-center"><img src="images/comment.svg" alt="comment" class="mr-1">${data.comments} comments</p>
                </div>
                <h1 class="text-black font-bold text-lg mb-2 truncate">${data.title}</h1>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <img src="${data.authorImage}" alt="user" class="w-6 h-6 rounded-full mr-1">
                        <p class="text-sm">${data.authorName}</p>
                    </div>
                    <button class="bg-gray-100 text-black text-sm py-2 px-3 rounded-full border border-gray-300 hover:bg-gray-300 transition">Keep Reading</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});

async function fetchDestinations() {
    try {
      const response = await fetch('destinations.json'); 
      const destinations = await response.json();
      renderDestinations(destinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  }

  function updateCountdown(element, deadline) {
    function calculateTimeLeft() {
      const now = new Date().getTime();
      const timeLeft = deadline - now;

      if (timeLeft <= 0) {
        element.innerHTML = `<span class="text-red-600 font-semibold">Expired</span>`;
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      element.innerHTML = `
      <div class="flex flex-col items-start p-2 rounded-lg shadow-md hidden new:block">
        <h6 class="text-white text-md font-bold mb-2">Promotion Ends In:</h6>
        <div class="flex -space-x-1">
          <div class="text-center p-1 rounded-md">
            <p class="text-lg font-bold bg-white px-3 py-2 rounded-md border border-gray-700">${days}</p>
            <p class="text-sm text-white font-bold">Days</p>
          </div>
          <div class="text-center p-1 rounded-md">
            <p class="text-lg font-bold bg-white px-3 py-2 rounded-md border border-gray-700">${hours}</p>
            <p class="text-sm text-white font-bold">Hrs</p>
          </div>
          <div class="text-center p-1 rounded-md">
            <p class="text-lg font-bold bg-white px-3 py-2 rounded-md border border-gray-700">${minutes}</p>
            <p class="text-sm text-white font-bold">Mins</p>
          </div>
          <div class="text-center p-1 rounded-md">
            <p class="text-lg font-bold bg-white px-3 py-2 rounded-md border border-gray-700">${seconds}</p>
            <p class="text-sm text-white font-bold">Secs</p>
          </div>
        </div>
      </div>
      `;
    }

    calculateTimeLeft();
    setInterval(calculateTimeLeft, 1000);
  }

  function renderDestinations(destinations) {
    const container = document.getElementById("destination-container");

    destinations.sort((a, b) => (b.promotions || 0) - (a.promotions || 0));
    const topDestinations = destinations.slice(0, 5);

    topDestinations.forEach((dest, index) => {
      const isFeatured = index === 0;
      const deadline = new Date().getTime() + dest.daysLeft * 24 * 60 * 60 * 1000;

      const card = document.createElement("div");
      card.className = `relative shadow-lg ${isFeatured ? 'md:col-span-2' : 'rounded-xl overflow-hidden'}`;

      card.innerHTML = `
      <div class="w-full h-[200px] sm:h-[250px] md:h-[300px] relative rounded-xl overflow-hidden ">
        <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover" />
        
        ${isFeatured && dest.promotions ? `
        <div class="absolute top-4 right-4 bg-white px-3 py-1 text-sm rounded flex space-x-2">
          <img src="images/promotions.svg" alt=""/>
          <span>${dest.promotions} Promotions</span>
        </div>` : ''}

        <div class="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow flex md:space-x-12">
          <div>
            <h3 class="font-semibold">${dest.name}</h3>
            <p class="text-sm text-gray-600">${dest.tours} Tours, ${dest.activities} Activities</p>
          </div>
          <button>
            <img src="images/arrownext.svg" alt="" class="bg-gray-100 rounded-full p-1" />
          </button>
        </div>
        
        ${isFeatured && dest.daysLeft ? `
        <div class="absolute bottom-2 sm:bottom-1 right-2 sm:right-4 ">
          <div class="countdown-timer"></div>
        </div>` : ''}
      </div>
      `;

      container.appendChild(card);
      if (isFeatured && dest.daysLeft) {
        const countdownElement = card.querySelector(".countdown-timer");
        updateCountdown(countdownElement, deadline);
      }
    });
  }

  fetchDestinations();

  //Categories section
  document.addEventListener("DOMContentLoaded", function() {
    const toggleText = document.getElementById("toggleText");
    const tourGrid = document.getElementById("tourGrid");
    let expanded = false;
    let tours = [];

    function renderTours(limit) {
        tourGrid.innerHTML = "";
        tours.slice(0, limit).forEach(tour => {
            tourGrid.innerHTML += `
                <div class="tour-item bg-white rounded-3xl shadow-md border border-gray-300 w-full max-w-xs mx-auto sm:w-[230px] h-[190px] relative flex flex-col justify-between p-4"> 
                    <img src="${tour.img}" alt="${tour.title}" class="w-full h-28 object-cover rounded-lg"> 
                    <div>
                        <h2 class="text-lg font-semibold">${tour.title}</h2>
                        <p class="flex items-center text-gray-500 text-sm mt-1">${tour.tours} Tours, ${tour.activities} Activities</p>
                    </div>
                    <a href="#" target="_blank" class="absolute bottom-4 right-4 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-200 transition"> 
                        <img src="images/arrownext.svg" alt="next" class="w-3 h-3">
                    </a>
                </div>`;
        });
    }

    function fetchTours() {
        fetch('tours.json')
            .then(response => response.json())
            .then(data => {
                tours = data;
                renderTours(8);
            })
            .catch(error => console.error('Error fetching tour data:', error));
    }

    fetchTours();

    toggleText.addEventListener("click", function() {
        if (!expanded) {
            renderTours(tours.length);
            toggleText.textContent = "Show Less";
        } else {
            renderTours(8);
            toggleText.textContent = "View More";
        }
        expanded = !expanded;
    });
});
function playYouTubeVideo(event, videoId) {
    event.preventDefault(); 
    const container = document.getElementById("videoContainer");
    container.innerHTML = `
        <iframe width="100%" height="100%" class="rounded-lg"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
        </iframe>
    `;
  }

  
//Travel Section
let tours = []; 
let currentFilter = { category: "all", duration: "all", rating: "all", price: "all" };
async function fetchTours() {
    try {
        const response = await fetch('travel.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tours:', error);
        return [];
    }
}

function loadLikes() {
    const savedLikes = JSON.parse(localStorage.getItem("likedTours")) || {};
    tours.forEach(tour => {
        if (savedLikes[tour.id]) {
            tour.liked = true;
        }
    });
}
function saveLikes() {
    const likedTours = {};
    tours.forEach(tour => {
        likedTours[tour.id] = tour.liked;
    });
    localStorage.setItem("likedTours", JSON.stringify(likedTours));
}

// Function to toggle like status
function toggleLike(tourId) {
    const tour = tours.find(t => t.id === tourId);
    if (tour) {
        tour.liked = !tour.liked;
        saveLikes();
        renderCards(currentFilter); 
    }
}


function matchesDuration(tourDuration, filterDuration) {
    if (filterDuration === "all") return true;

    const days = parseInt(tourDuration);
    if (filterDuration === "1-3 Days") return days >= 1 && days <= 3;
    if (filterDuration === "4-7 Days") return days >= 4 && days <= 7;
    if (filterDuration === "8+ Days") return days >= 8;
    return false;
}

// Function to generate dynamic cards
function renderCards(filter = { category: "all", duration: "all", rating: "all", price: "all" }) {
    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = ""; 

    const filteredTours = tours.filter(tour => {
       
        const matchesCategory = filter.category === "all" || tour.tag === filter.category;

        const matchesDurationFilter = filter.duration === "all" || matchesDuration(tour.duration, filter.duration);

        const matchesRating = filter.rating === "all" || 
            (filter.rating === "4+ Stars" && tour.rating >= 4) || 
            (filter.rating === "3+ Stars" && tour.rating >= 3) || 
            (filter.rating === "2+ Stars" && tour.rating >= 2);

        const matchesPrice = filter.price === "all" || 
            (filter.price === "$0 - $100" && parseFloat(tour.price.replace("$", "")) <= 100) || 
            (filter.price === "$100 - $300" && parseFloat(tour.price.replace("$", "")) > 100 && parseFloat(tour.price.replace("$", "")) <= 300) || 
            (filter.price === "$300+" && parseFloat(tour.price.replace("$", "")) > 300);

        return matchesCategory && matchesDurationFilter && matchesRating && matchesPrice;
    });

    const limitedTours = filteredTours.slice(0, 6);


    limitedTours.forEach(tour => {
        const cardHTML = `
            <div class="card bg-[#fff] rounded-3xl shadow-md overflow-hidden w-[260px]">
                <div class="relative">
                    <img src="${tour.image}" alt="journey" class="w-full h-[200px] object-cover">
                    <p class="bg-white rounded-full absolute top-2 left-2 p-2 font-sans text-[12px] font-semibold ${
                        tour.tag === 'Popular' ? 'text-yellow-500' : tour.tag === 'Best Seller' ? 'text-green-500' : 'text-yellow-500'
                    }">
                        ${tour.tag}
                    </p>
                    <p class="bg-white rounded-full absolute top-2 right-2 p-2 cursor-pointer" onclick="toggleLike(${tour.id})">
                        <img src="${tour.liked ? 'images/heartfilled.svg' : 'images/heart.svg'}" alt="heart" class="w-5 h-5">
                    </p>
                </div>
                <div class="card-content p-5 bg-[#fff] bg-opacity-100 rounded-3xl shadow-md -mt-10 z-10">
                    <div class="p-3 bg-[#fff] rounded-full shadow-md border border-gray-300 w-[160px] relative -mt-12 left-16 z-10">
                        <p class="flex items-center text-black text-[12px] font-semibold">
                            <img src="images/star.svg" alt="star" class="w-4 h-4 mr-2">
                            ${tour.rating} 
                            <span class="text-gray-700 text-[12px] font-normal ml-1"> (${tour.reviews} reviews)</span>
                        </p>               
                    </div>
                    <h1 class="text-[#000] font-bold text-[16px] mb-2">${tour.title}</h1>
                    <div class="flex items-center justify-between">
                        <p class="flex items-center text-[12px] text-gray-700 mb-2">
                            <img src="images/clock.svg" alt="clock" class="w-4 h-4 mr-2">
                            ${tour.duration}
                        </p>
                        <p class="flex items-center text-[12px] text-gray-700 mb-4">
                            <img src="images/user.svg" alt="user" class="w-4 h-4 mr-2">
                            ${tour.guests}
                        </p>
                    </div>
                    <div class="flex items-center justify-between mb-1">
                        <h1 class="text-[#000] font-bold text-[16px] mb-4">${tour.price} <span class="text-gray-400 font-normal text-1">/person</span></h1>
                        <button class="bg-gray-100 text-[#000] font-semibold text-[14px] py-2 px-3 rounded-full border border-gray-300 hover:bg-gray-300 transition">Book Now</button>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.innerHTML += cardHTML;
    });
}

// Toggle dropdown menus
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", function() {
        
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.add("hidden");
        });


        const dropdown = this.nextElementSibling;
        dropdown.classList.toggle("hidden");
    });
});

// Close dropdowns when clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-btn")) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.classList.add("hidden");
        });
    }
});

// Filter cards based on dropdown selection
document.querySelectorAll(".dropdown-menu li").forEach(item => {
    item.addEventListener("click", function () {
        const filterValue = this.getAttribute("data-filter");

        const button = this.closest(".dropdown-menu").previousElementSibling;
        const filterType = button.textContent.trim().split(":")[0].trim();

        button.innerHTML = filterValue !== "all"
            ? `${filterType}: ${filterValue} <span><img src="images/arrow.svg" alt="arrow" class="w-3 h-3"></span>`
            : `${filterType} <span><img src="images/arrow.svg" alt="arrow" class="w-3 h-3"></span>`;

        if (filterType === "Categories") {
            currentFilter.category = filterValue;
        } else if (filterType === "Duration") {
            currentFilter.duration = filterValue;
        } else if (filterType === "Review/Rating") {
            currentFilter.rating = filterValue;
        } else if (filterType === "Price range") {
            currentFilter.price = filterValue;
        }

        renderCards(currentFilter);
    });
});

// Initialize the page
async function initializePage() {
    tours = await fetchTours();
    if (tours.length > 0) {
        loadLikes(); 
        renderCards(currentFilter);
    } else {
        console.error('No tours data found.');
    }
}

initializePage();

// Retrieve destinations from JSON
async function getDestinations() {
    try {
        const response = await fetch('destinations1.json'); 
        const destinations = await response.json();      
        displayDestinations(destinations);
    } catch (error) {
        console.error('Error retrieving destinations:', error);
    }
}

function displayDestinations(destinations) {
    const container = document.querySelector(".destination-grid");
    container.innerHTML = "";

    destinations.slice(0, 8).forEach(destination => { 
        const card = document.createElement("div");
        card.className = "destination-card flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg";
        card.innerHTML = `
            <img src="${destination.image}" alt="${destination.name}" class="destination-image w-16 h-16 object-cover rounded-lg">
            <div class="destination-info flex flex-col">
                <h3 class="destination-name text-black font-bold text-lg">${destination.name}</h3>
                <p class="destination-tours flex items-center text-gray-400 text-xs mt-1">
                    <img src="images/flag.svg" alt="flag" class="flag-icon w-4 h-4 mr-1">
                    ${destination.tours} Tours
                </p>
            </div>
            <div class="destination-action bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center shadow-md ml-auto cursor-pointer hover:bg-gray-200 transition relative top-2" data-url="${destination.url}">
                <img src="images/arrownext.svg" alt="next" class="arrow-icon w-3 h-3">
            </div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getDestinations();  
    const container = document.querySelector(".destination-grid");

    container.addEventListener("click", function(e) {
        if (e.target.closest('.destination-action')) {
            const url = e.target.closest('.destination-action').getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        }
    });
});
function openChatbot() {
    let container = document.getElementById('chatbot-container');
    let iframe = document.getElementById('chatbot-frame');
    iframe.src = './travelbot/travelbot.html';
    container.style.display = 'flex';

    let closeButton = document.querySelector('.close-button');
    closeButton.style.display = 'block';
}

function closeChatbot() {
    document.getElementById('chatbot-container').style.display = 'none';

    let closeButton = document.querySelector('.close-button');
    closeButton.style.display = 'none'; 
}
