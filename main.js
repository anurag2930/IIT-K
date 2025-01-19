// import { fetchProducts, analyzeSentiment } from './api.js';
// import { renderProducts, updateCartBadge, displayErrorMessage, renderComments, createCommentElement } from './dom.js';
// import { getCartCounter, getRandomDefaultImageUrl } from './utils.js';

// export function openModal(product) {
//     const modal = document.getElementById("productModal");
//     const modalImage = document.getElementById("modalImage");
//     const modalName = document.getElementById("modalName");
//     const modalCategory = document.getElementById("modalCategory");
//     const modalDescription = document.getElementById("modalDescription");
//     const modalCurrentPrice = document.getElementById("modalCurrentPrice");
//     const modalDiscountPrice = document.getElementById("modalDiscountPrice");
//     const modalRating = document.getElementById("modalRating");
//     const modalReviews = document.getElementById("modalReviews");
//     const modalAvailability = document.getElementById("modalAvailability");
//     const commentsList = document.getElementById("commentsList");
//     const addCommentButton = document.getElementById("addCommentButton");

//     // Populate modal with product data
//     modalImage.src = product.product_image_link;
//     modalImage.onerror = () => {
//         modalImage.src = getRandomDefaultImageUrl();
//     };
//     modalName.textContent = product.product_name;
//     modalCategory.textContent = product.category;
//     modalDescription.textContent = product.product_description;
//     modalCurrentPrice.textContent = `Rs ${product.product_price.current_price}`;

//     if (product.product_price.discounted_price) {
//         modalDiscountPrice.textContent = `Rs ${product.product_price.discounted_price}`;
//         modalDiscountPrice.style.display = "inline";
//     } else {
//         modalDiscountPrice.style.display = "none";
//     }

//     modalRating.textContent = `★ ${product.product_rating.rating}/${product.product_rating.out_of}`;
//     modalReviews.textContent = `(${product.number_of_ratings_reviews} reviews)`;
//     modalAvailability.textContent = product.availability_status;
//     modalAvailability.className = `availability-badge ${product.availability_status.toLowerCase().replace(/\s+/g, '-')}`;

//     // Render comments
//     renderComments(product.customer_comments, commentsList);

//     // Reset new comment input
//     document.getElementById("newCommentText").value = "";

//     // Replace and rebind add comment button
//     const newAddCommentButton = addCommentButton.cloneNode(true);
//     addCommentButton.parentNode.replaceChild(newAddCommentButton, addCommentButton);
//     newAddCommentButton.addEventListener("click", () => {
//         const commentText = document.getElementById("newCommentText").value.trim();
//         if (commentText === "") {
//             alert("Please enter a comment.");
//             return;
//         }
//         addNewComment(product.id, commentText, commentsList);
//     });

//     // Show modal
//     modal.style.display = "block";
// }

// async function addNewComment(productId, commentText, container) {
//     const pendingComment = createCommentElement(commentText, "pending");
//     container.appendChild(pendingComment);
//     pendingComment.scrollIntoView({ behavior: "smooth" });

//     try {
//         const sentiment = await analyzeSentiment(commentText);

//         pendingComment.classList.remove("pending");

//         if (sentiment && sentiment.sentiment) {
//             switch (sentiment.sentiment.toLowerCase()) {
//                 case "very positive":
//                     pendingComment.classList.add("positive");
//                     pendingComment.querySelector(".emoji").textContent = "😊";
//                     break;
//                 case "negative":
//                     pendingComment.classList.add("negative");
//                     pendingComment.querySelector(".emoji").textContent = "😞";
//                     break;
//                 case "neutral":
//                 default:
//                     pendingComment.classList.add("neutral");
//                     pendingComment.querySelector(".emoji").textContent = "😐";
//                     break;
//             }
//         } else {
//             pendingComment.classList.add("neutral");
//             pendingComment.querySelector(".emoji").textContent = "😐";
//         }
//     } catch (error) {
//         console.error("Error analyzing sentiment:", error);
//         pendingComment.classList.remove("pending");
//         pendingComment.classList.add("neutral");
//         pendingComment.querySelector(".emoji").textContent = "😐";
//     }
// }

// function initializeModal() {
//     const modal = document.getElementById("productModal");
//     const closeButton = document.querySelector(".close-button");

//     closeButton.addEventListener("click", () => {
//         modal.style.display = "none";
//     });

//     window.addEventListener("click", (event) => {
//         if (event.target === modal) {
//             modal.style.display = "none";
//         }
//     });
// }

// async function fetchAndRenderProducts() {
//     try {
//         const data = await fetchProducts();
//         const products = data.products;

//         updateCartBadge(getCartCounter());
//         renderProducts(products);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         displayErrorMessage('Failed to load products. Please try again later.');
//     }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     initializeModal();
//     fetchAndRenderProducts();
// });

export const PRODUCT_API_URL = "https://productapi-wuob.onrender.com/product";
export const SENTIMENT_API_URL = "https://sentimentanalysis-b3pi.onrender.com/predict";

export const DEFAULT_IMAGE_URLS = [
    "https://picsum.photos/100/100?image=10",
    "https://picsum.photos/100/100?image=20",
    "https://picsum.photos/100/100?image=30",
    "https://picsum.photos/100/100?image=40",
    "https://picsum.photos/100/100?image=50",
];
document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("headerContainer");

    fetch("header.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error loading header: ${response.status}`);
            }
            return response.text();
        })
        .then((headerHTML) => {
            headerContainer.innerHTML = headerHTML;

            // Reinitialize any scripts or functionality in the loaded header
            const cartCounter = getCartCounter();
            updateCartBadge(cartCounter);
        })
        .catch((error) => {
            console.error("Error loading header:", error);
        });
});

export function getRandomDefaultImageUrl() {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGE_URLS.length);
    return DEFAULT_IMAGE_URLS[randomIndex];
}

export function getCartCounter() {
    const cookie = document.cookie;
    const match = cookie.match(/,counter=(\d+)/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return 0;
}

export async function fetchProducts() {
    try {
        const response = await fetch(PRODUCT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function analyzeSentiment(text) {
    try {
        const response = await fetch(SENTIMENT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error analyzing sentiment:", error.message);
        return null;
    }
}

export function updateCartBadge(counter) {
    const badge = document.getElementById("badge");
    if (badge) {
        badge.textContent = counter;
    }
}

export function renderProducts(products) {
    const containerClothing = document.getElementById("containerClothing");
    const containerAccessories = document.getElementById("containerAccessories");
    containerClothing.innerHTML = '';
    containerAccessories.innerHTML = '';
    products.forEach(product => {
        const productElement = createProductElement(product);
        if (product.category.toLowerCase().includes('accessory')) {
            containerAccessories.appendChild(productElement);
        } else {
            containerClothing.appendChild(productElement);
        }
    });
}

export function createProductElement(product) {
    const boxDiv = document.createElement("div");
    boxDiv.className = "box";
    boxDiv.dataset.productId = product.id;

    const imgTag = document.createElement("img");
    imgTag.src = product.product_image_link;
    imgTag.alt = product.product_name;
    imgTag.onerror = () => {
        imgTag.src = getRandomDefaultImageUrl();
    };

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "details";

    const h3 = document.createElement("h3");
    h3.textContent = product.product_name;

    const h4 = document.createElement("h4");
    h4.textContent = product.category;

    const priceDiv = createPriceElement(product.product_price);

    const ratingDiv = createRatingElement(product);

    const availabilityBadge = document.createElement("div");
    availabilityBadge.className = `availability-badge ${product.availability_status.toLowerCase().replace(/\s+/g, '-')}`;
    availabilityBadge.textContent = product.availability_status;

    detailsDiv.append(h3, h4, priceDiv, ratingDiv, availabilityBadge);
    boxDiv.appendChild(imgTag);
    boxDiv.appendChild(detailsDiv);
    boxDiv.addEventListener("click", () => openModal(product));
    return boxDiv;
}

function createPriceElement(price) {
    const priceDiv = document.createElement("div");
    priceDiv.className = "price-container";

    const currentPrice = document.createElement("h2");
    currentPrice.textContent = `Rs ${price.current_price}`;

    priceDiv.appendChild(currentPrice);

    if (price.discounted_price) {
        const discountPrice = document.createElement("span");
        discountPrice.className = "discount-price";
        discountPrice.textContent = `Rs ${price.discounted_price}`;
        priceDiv.appendChild(discountPrice);
    }
    return priceDiv;
}

function createRatingElement(product) {
    const ratingDiv = document.createElement("div");
    ratingDiv.className = "rating-container";
    ratingDiv.innerHTML = `
        <span class="rating">★ ${product.product_rating.rating}/${product.product_rating.out_of}</span>
        <span class="reviews">(${product.number_of_ratings_reviews} reviews)</span>
    `;
    return ratingDiv;
}

export function renderComments(comments, container) {
    container.innerHTML = '';
    if (comments.length === 0) {
        container.innerHTML = '<p>No comments yet.</p>';
        return;
    }
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment.comment, comment.label);
        container.appendChild(commentElement);
    });
}

export function createCommentElement(text, label) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    let sentimentClass = "";
    let emoji = "";

    switch (label.toLowerCase()) {
        case "positive":
            sentimentClass = "positive";
            emoji = "😊";
            break;
        case "negative":
            sentimentClass = "negative";
            emoji = "😞";
            break;
        case "neutral":
            sentimentClass = "neutral";
            emoji = "😐";
            break;
        case "pending":
            sentimentClass = "pending";
            emoji = "⏳";
            break;
        default:
            sentimentClass = "neutral";
            emoji = "😐";
    }

    commentDiv.classList.add(sentimentClass);
    const emojiSpan = document.createElement("span");
    emojiSpan.classList.add("emoji");
    emojiSpan.textContent = emoji;
    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    commentDiv.appendChild(emojiSpan);
    commentDiv.appendChild(textSpan);
    return commentDiv;
}

export function displayErrorMessage(message) {
    const mainContainer = document.getElementById("mainContainer");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    mainContainer.appendChild(errorDiv);
}

export function openModal(product) {
    const modal = document.getElementById("productModal");
    const modalImage = document.getElementById("modalImage");
    const modalName = document.getElementById("modalName");
    const modalCategory = document.getElementById("modalCategory");
    const modalDescription = document.getElementById("modalDescription");
    const modalCurrentPrice = document.getElementById("modalCurrentPrice");
    const modalDiscountPrice = document.getElementById("modalDiscountPrice");
    const modalRating = document.getElementById("modalRating");
    const modalReviews = document.getElementById("modalReviews");
    const modalAvailability = document.getElementById("modalAvailability");
    const commentsList = document.getElementById("commentsList");
    const addCommentButton = document.getElementById("addCommentButton");

    modalImage.src = product.product_image_link;
    modalImage.onerror = () => {
        modalImage.src = getRandomDefaultImageUrl();
    };
    modalName.textContent = product.product_name;
    modalCategory.textContent = product.category;
    modalDescription.textContent = product.product_description;
    modalCurrentPrice.textContent = `Rs ${product.product_price.current_price}`;

    if (product.product_price.discounted_price) {
        modalDiscountPrice.textContent = `Rs ${product.product_price.discounted_price}`;
        modalDiscountPrice.style.display = "inline";
    } else {
        modalDiscountPrice.style.display = "none";
    }

    modalRating.textContent = `★ ${product.product_rating.rating}/${product.product_rating.out_of}`;
    modalReviews.textContent = `(${product.number_of_ratings_reviews} reviews)`;
    modalAvailability.textContent = product.availability_status;
    modalAvailability.className = `availability-badge ${product.availability_status.toLowerCase().replace(/\s+/g, '-')}`;

    renderComments(product.customer_comments, commentsList);
    document.getElementById("newCommentText").value = "";

    const newAddCommentButton = addCommentButton.cloneNode(true);
    addCommentButton.parentNode.replaceChild(newAddCommentButton, addCommentButton);
    newAddCommentButton.addEventListener("click", () => {
        const commentText = document.getElementById("newCommentText").value.trim();
        if (commentText === "") {
            alert("Please enter a comment.");
            return;
        }
        addNewComment(product.id, commentText, commentsList);
    });
    modal.style.display = "block";
}

async function addNewComment(productId, commentText, container) {
    const pendingComment = createCommentElement(commentText, "pending");
    container.appendChild(pendingComment);
    pendingComment.scrollIntoView({ behavior: "smooth" });

    try {
        const sentiment = await analyzeSentiment(commentText);
        pendingComment.classList.remove("pending");

        if (sentiment && sentiment.sentiment) {
            switch (sentiment.sentiment.toLowerCase()) {
                case "very positive":
                    pendingComment.classList.add("positive");
                    pendingComment.querySelector(".emoji").textContent = "😊";
                    break;
                case "negative":
                    pendingComment.classList.add("negative");
                    pendingComment.querySelector(".emoji").textContent = "😞";
                    break;
                case "neutral":
                default:
                    pendingComment.classList.add("neutral");
                    pendingComment.querySelector(".emoji").textContent = "😐";
                    break;
            }
        } else {
            pendingComment.classList.add("neutral");
            pendingComment.querySelector(".emoji").textContent = "😐";
        }
    } catch (error) {
        console.error("Error analyzing sentiment:", error);
        pendingComment.classList.remove("pending");
        pendingComment.classList.add("neutral");
        pendingComment.querySelector(".emoji").textContent = "😐";
    }
}

function initializeModal() {
    const modal = document.getElementById("productModal");
    const closeButton = document.querySelector(".close-button");

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

async function fetchAndRenderProducts() {
    try {
        const data = await fetchProducts();
        const products = data.products;

        updateCartBadge(getCartCounter());
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        displayErrorMessage('Failed to load products. Please try again later.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeModal();
    fetchAndRenderProducts();
});
