// Put your applicaiton javascript here
'use strict';
/**Modal toggle */

//Open close modal
function openModal() {
  document.getElementById('myModal').style.display = 'flex';
}

// function openCart() {
//   document.getElementById('myModal2').style.display = 'flex';
// }

function toggleForm(formToShow) {
  const login = document.getElementById('login')
  const register = document.getElementById('register')



  if (formToShow === 'register') {
    login.classList.add('hidden')
    register.classList.remove('hidden')
  } else {
    login.classList.remove('hidden')
    register.classList.add('hidden')
  }
}


// Function to close the modal
function closeModal() {
  document.getElementById('myModal').style.display = 'none';
}


// Function to close the cart
function closeCartbar() {
  document.getElementById('myModal2').style.display = 'none';
}

// Close the modal if the overlay (background) is clicked
window.onclick = function (event) {
  if (event.target === document.getElementById('myModal')) {
    closeModal();
  }
};







/**add event on element */


const addEventOnElem = function (elem, type, callback) {
  if (!elem) {
    return;
  }

  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      if (elem[i] && typeof elem[i].addEventListener === 'function') {
        elem[i].addEventListener(type, callback);
      } else {
        console.error('Element is not valid or does not support addEventListener:', elem[i]);
      }
    }
  } else {
    if (typeof elem.addEventListener === 'function') {
      elem.addEventListener(type, callback);
    } else {
      console.error('Element is not valid or does not support addEventListener:', elem);
    }
  }
}

/**navbar- toggle */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("data-nav-link")
const overlay = document.querySelector("[data-overlay]")

const toggleNavbar = function () {
  navbar.classList.toggle('active');
  overlay.classList.toggle('active');
}

addEventOnElem(navTogglers, "click", toggleNavbar)


const closeNavbar = function () {
  navbar.classList.remove('active')
  overlay.classList.remove('active')
}

addEventOnElem(navbarLinks, "click", closeNavbar)


/**
 * sticky-header & back-to-top
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrolledPos = 0;
let isScrolling = false;

const handleScroll = function () {
  const currentScrollY = window.scrollY;

  // Header Active (Background & Back-to-top)
  if (currentScrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }

  // Header Sticky (Hide on scroll down, show on scroll up)
  if (lastScrolledPos >= currentScrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = currentScrollY;
  isScrolling = false;
};

// Throttle scroll events using requestAnimationFrame
window.addEventListener("scroll", function () {
  if (!isScrolling) {
    window.requestAnimationFrame(handleScroll);
    isScrolling = true;
  }
}, { passive: true });

/**scroll reveal effect using IntersectionObserver (Replaces getBoundingClientRect) */

const sections = document.querySelectorAll("[data-section]");

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target); // Stop observing once revealed
    }
  });
}, {
  threshold: 0.2 // Trigger when 20% of the section is visible
});

sections.forEach(section => revealObserver.observe(section));





// document.addEventListener('DOMContentLoaded', function(){
//   const text1 = document.getElementById('text1');
//   const text2 = document.getElementById('text2');
//   const text3 = document.getElementById('text3');

//   const texts = [text1, text2, text3];
//   let currentIndex = 0;

//   // Apply CSS styles for smoother transitions
//   texts.forEach(text => {
//     text.style.position = 'absolute';
//     text.style.transition = 'left 0.5s ease-in-out';
//   });

//   function slideToMiddle(element){
//     element.style.left = '40%';
//   }

//   function resetPosition(element){
//     element.style.left = '-100%';
//   }

//   function slideText(){
//     resetPosition(texts[currentIndex]);
//     currentIndex = (currentIndex + 1) % texts.length;
//     slideToMiddle(texts[currentIndex]);
//   }

//   // Initially, display the first element in the middle
//   slideToMiddle(texts[currentIndex]);

//   // Change text every 3 seconds
//   setInterval(slideText, 3000);
// });






// async function updateCartUI(cartData) {
//   try {
//     // Assuming you have elements in your side cart with specific IDs or classes
//     let cartItemElements = document.querySelectorAll('.cart-item');
//     let cartSubtotalElement = document.getElementById('cart-subtotal');

//     // Loop through the cart items to update or fetch additional data if needed
//     for (let [index, item] of cartData.items.entries()) {
//       let itemElement = cartItemElements[index];

//       if (itemElement) {
//         // Update the existing item in the cart
//         itemElement.querySelector('.cart-item-title').textContent = item.product_title;
//         itemElement.querySelector('.cart-item-variant').textContent = item.variant_title;
//         itemElement.querySelector('.cart-item-quantity').textContent = `Quantity: ${item.quantity}`;
//         itemElement.querySelector('.cart-item-price').textContent = `${(item.price / 100).toFixed(2)} ${cartData.currency}`;

//         // Async fetch additional data if necessary (e.g., fetching an image)
//         let imageUrl = await fetchImageUrl(item);
//         itemElement.querySelector('.cart-item-image').src = imageUrl;
//         itemElement.querySelector('.cart-item-image').alt = item.title;
//       } else {
//         // Optionally handle adding new items asynchronously
//         await addNewCartItem(item);
//       }
//     }

//     // Update the subtotal
//     if (cartSubtotalElement) {
//       cartSubtotalElement.textContent = `Subtotal: ${(cartData.total_price / 100).toFixed(2)} ${cartData.currency}`;
//     }
//   } catch (error) {
//     console.error('Error updating cart UI:', error);
//   }
// }





document.addEventListener("DOMContentLoaded", function () {
  var loader = document.getElementById('loader');
  var cartContent = document.getElementById('cart-content');

  // Show the loader
  loader.style.display = 'block';

  // Simulate data fetching (you can replace this with actual data fetching logic)
  setTimeout(function () {
    // Hide the loader
    loader.style.display = 'none';

    // Show the cart content
    cartContent.style.display = 'block';
  }, 1000); // Adjust the time according to your data fetching process
});



// Initializations
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS if available (Avoid duplicate check)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100
    });
  }
});














