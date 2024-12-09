import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { CartService } from 'app/shared/services/cart/cart.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, ButtonModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  public totalQuantity = this.cartService.selectTotalQuantity();
  public cart = this.cartService.selectAll();

  public isExpanded = false;

  public onClick() {
    this.isExpanded = !this.isExpanded;
  }

  public removeFromCart(id: number) {
    this.cartService.removeProduct(id);
  }

  public addToCart(product: Product) {
    this.cartService.addProduct(product);
  }

  public clearAll() {
    this.cartService.clear();
  }
}
