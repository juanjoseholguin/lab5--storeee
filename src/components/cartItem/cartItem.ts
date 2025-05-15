import { ProductActions } from "../../flux/Actions";
import { CartItem, State, store } from "../../flux/Store";

class CartItems extends HTMLElement {
    private unsubscribe?: () => void;

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();

        this.unsubscribe = store.subscribe((state: State) => { 
            this.handleChange(state);
        });
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    handleChange(state: State) {
        this.render(state);
    }

    render(state = store.getState()) {
        if (!this.shadowRoot) return;

        const totalPrice = state.cart.reduce((sum, item) => sum + item.product.price, 0).toFixed(2);

        this.shadowRoot.innerHTML = `
<style>
    .cart-container {
        background: #f9f9ff;
        border: 2px solid #e3e3ff;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        max-width: 900px;
        margin-inline: auto;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        font-family: 'Poppins', sans-serif;
    }

    .cart-title {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #333;
    }

    .total-price {
        font-size: 1.1rem;
        color: #444;
        margin-bottom: 1rem;
    }

    .cart-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
    }

    .cart-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 1rem;
        transition: transform 0.2s;
    }

    .cart-item:hover {
        transform: scale(1.01);
    }

    .cart-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0;
    }

    .info {
        flex-grow: 1;
    }

    .info h2 {
        margin: 0;
        font-size: 1.1rem;
        color: #222;
    }

    .info p {
        margin: 0.3rem 0;
        font-size: 0.9rem;
        color: #666;
    }

    .info h3 {
        margin: 0.5rem 0 0 0;
        font-size: 1rem;
        color: #4a4a4a;
    }

    .remove {
        background-color: #4b0082;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-weight: bold;
        font-size: 0.9rem;
        transition: 0.2s;
    }

    .remove:hover {
        background-color:rgb(49, 3, 81);
    }
</style>

<div class="cart-container">
    <div class="cart-title">Productos en el carrito</div>
    <div class="total-price">Total: $${totalPrice}</div>
    <ul class="cart-items">
        ${state.cart.map((cartItem: CartItem) => {
            return `
                <li class="cart-item">
                    <img src="${cartItem.product.image}" alt="${cartItem.product.title}" />
                    <div class="info">
                        <h2>${cartItem.product.title}</h2>
                        <p>${cartItem.product.description}</p>
                        <h3>$${cartItem.product.price}</h3>
                    </div>
                    <button class="remove" id="${cartItem.id}">Eliminar</button>
                </li>
            `;
        }).join("")}
    </ul>
</div>
        `;

        const removeButtons = this.shadowRoot.querySelectorAll('.remove');
        removeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('id');
                if (id) {
                    ProductActions.removeFromCart(id);
                }
            });
        });
    }
}

export default CartItems;