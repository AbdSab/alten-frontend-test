import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from './cart.model';
import { Product } from 'app/products/data-access/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  state = signal<CartItem[]>([]);

  selectAll() {
    return computed(() => this.state());
  }

  selectTotalPrice() {
    return computed(() => this.state().reduce((total, item) => item.product.price * item.quantity + total, 0));
  }

  selectTotalQuantity() {
    return computed(() => this.state().reduce((total, item) => item.quantity + total, 0));
  }

  selectItemByProductId(id: number) {
    return computed(() => this.state().find((item) => item.product.id === id));
  }

  addProduct(product: Product) {
    this.state.update(currentState => {
      const newCurrentState = [...currentState];
      const foundProduct = newCurrentState.find(item => item.product.id === product.id);
      if(foundProduct) {
        foundProduct.quantity++;
        return newCurrentState;
      }
      return [...newCurrentState, {product, quantity: 1}];
    });
  }

  removeProduct(id: number) {
    this.state.update(currentState => {
      const newCurrentState = [...currentState];
      const foundProduct = newCurrentState.find(item => item.product.id === id);
      if(!foundProduct) return newCurrentState;

      if(foundProduct.quantity > 1) {
        foundProduct.quantity--;
        return newCurrentState;
      }

      return newCurrentState.filter(item => item.product.id !== id);
    });
  }

  clear() {
    this.state.set([]);
  }
}
