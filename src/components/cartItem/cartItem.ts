import { ProductActions } from "../../flux/Actions";
import { CartItem, State, store } from "../../flux/Store";

class CartItems extends HTMLElement {
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
        const id = this.getAttribute('id');
        this.shadowRoot.innerHTML = `
<style>
    .cart-container {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 800px;
        background: #1e1e2f;
        border-bottom: 2px solid #6a0dad;
        border-radius: 0 0 10px 10px;
        padding: 10px 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        z-index: 1000;
        font-family: 'Poppins', sans-serif;
    }

    .cart-title {
        color: #ffd700;
        margin-bottom: 10px;
        font-size: 1.1em;
    }

    .cart-items {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 300px;
        overflow-y: auto;
    }

    .cart-item {
        background: #2d2d44;
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 10px;
        color: white;
        gap: 15px;
    }

    .cart-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        flex-shrink: 0;
    }

    .cart-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .cart-info h3 {
        margin: 0;
        font-size: 1em;
        color: #ffccff;
    }

    .cart-info p {
        margin: 3px 0;
        font-size: 0.85em;
        color: #dddddd;
    }

    .cart-info span {
        font-weight: bold;
        color: #ffd700;
        font-size: 0.9em;
    }

    .remove {
        background-color: #ff4d4d;
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        color: white;
        font-size: 0.8em;
        transition: 0.2s;
    }

    .remove:hover {
        background-color: #cc0000;
    }
</style>



            <ul class="cart-items">
                ${state.cart.map ((cartItem: CartItem) => {
                return`
                    <li class="cart-item">
                        <img src="${cartItem.product.image}" alt="${cartItem.product.title}">
                        <h2>${cartItem.product.title}</h2>
                        <p>${cartItem.product.description}</p>
                        <h3>$${cartItem.product.price}</h3>
                        <button class="remove" id="${cartItem.id}">Remove</button>
                    </li>
                `}).join("")}
            </ul>
        `;

        console.log("PRODUCTOS DESDE EL COMPONENTE DE CARRITO", state.products);

        const removeButton = this.shadowRoot.querySelectorAll('.remove');
        removeButton.forEach((button) => {
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