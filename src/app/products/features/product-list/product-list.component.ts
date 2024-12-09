import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { CurrencyPipe, NgIf } from '@angular/common';
import { NgClass, NgFor } from '@angular/common';
import { AvailabilityPipe } from "app/shared/pipes/availability.pipe";
import { CartService } from "app/shared/services/cart/cart.service";
import { PaginatorModule } from "primeng/paginator";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, CurrencyPipe, AvailabilityPipe, NgClass, NgFor, NgIf, PaginatorModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  public readonly ratingReference: Array<number> = Array(5).fill(0);

  public cartItems = this.cartService.selectAll();

  public totalRecords: number = 0;
  public first: number = 0;
  public rows: number = 10;

  ngOnInit() {
    this.productsService.get().subscribe((data) => {
      this.totalRecords = data.length;
    });
  }

  public getCartQuantityByProduct(id: number) {
    return this.cartService.selectItemByProductId(id)
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public addToCart(product: Product) {
    this.cartService.addProduct(product);
  }

  public removeFromCart(id: number) {
    this.cartService.removeProduct(id);
  }

  public onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  public getPaginatedProducts() {
    return this.products().slice(this.first, this.first + this.rows);
  }
}
