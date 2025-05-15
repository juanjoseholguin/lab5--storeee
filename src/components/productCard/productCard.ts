import { ProductActions } from "../../flux/Actions";
import { State, store } from "../../flux/Store";

class ProductCard extends HTMLElement {
    connectedCallback() {
        store.subscribe((state: State) => {this.handleChange(state)});
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    handleChange(state: State) {
        this.render(state);
    }

    render(state = store.getState()) {
        if (!this.shadowRoot) return;

        const title = this.getAttribute('title') || 'Product Title'; 
        const price = this.getAttribute('price') || 0;
        const description = this.getAttribute('description') || 'Product Description';
        const image = this.getAttribute('image');
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                flex: 1 1 calc(33.333% - 48px);
                max-width: 350px;
                margin: 24px;
                box-sizing: border-box;
            }

            .product-card {
                background: linear-gradient(135deg, #6a0dad, #1a1a1a);
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                color: #fff;
                font-family: 'Poppins', sans-serif;
            }

            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 24px rgba(106, 13, 173, 0.5);
            }

            .product-image {
                max-width: 100%;
                height: auto;
                border-radius: 12px;
                transition: transform 0.3s ease;
            }

            .product-card:hover .product-image {
                transform: scale(1.05);
            }

            .product-title {
                font-size: 1.5em;
                margin: 10px 0;
                color: #ffccff;
            }

            .product-price {
                font-size: 1.3em;
                color: #ffd700;
                margin: 8px 0;
            }

            .product-description {
                font-size: 1em;
                color: #dddddd;
                margin-bottom: 12px;
            }

            button {
                background-color: #ffcc00;
                color: #1a1a1a;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease;
                font-family: 'Poppins', sans-serif;
            }

            button:hover {
                background-color: #ffa500;
                transform: scale(1.05);
            }
        </style>

        <div class="product-card">
            <img src="${image}" alt="${title}" class="product-image" />
            <h3 class="product-title">${title}</h3>
            <p class="product-price">$${price}</p>
            <p class="product-description">${description}</p>
            <button id="add-to-cart">Add to Cart</button>
        </div>
        `;

        this.shadowRoot.querySelector('#add-to-cart')?.addEventListener('click', () => {
            const product = {
                id: state.cart.length + 1,
                title,
                price: Number(price),
                description,
                image: this.getAttribute('image') || '',
            };
            ProductActions.addToCart(product);
        });
    }
}

export default ProductCard;
