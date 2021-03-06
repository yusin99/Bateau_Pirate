import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesModel } from 'src/app/models/categories.model';
import { ServerResponse } from 'src/app/models/product.model';
import { ProductModelServer } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: ProductModelServer[] = [];
  filterTerm!: any;
  email!: any;
  prices: any[] = [];
  vinyl: any[] = [];
  totalLength: number | undefined;
  page = 1;
  public arr = JSON.parse(window.localStorage.getItem('cart') || '{}');

  constructor(
    private cartServiece: CartService,
    private userService: UserService,
    private productService: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // console.log(this.arr.prodData[0]);
    this.productService.getAllProducts(6000).subscribe((prods: any) => {
      // console.log(prods);
      this.userService.userData$.subscribe((data) => {
        this.email = data.email;
      });
      this.products = prods.products;
      this.totalLength = prods.products.length;
      for (let i = 0; i < prods.products.length; i++) {
        this.prices.push(prods.products[i].prixHT);
        this.vinyl.push(prods.products[i].nomVinyl);
      }
    });
  }

  selectProduct(id: Number) {
    this.email = null;
    this.router.navigate(['/product/', id]).then();
  }

  addToCart(idVinyl: number) {
    // console.log(idVinyl);
    this.cartServiece.AddProductToCart(idVinyl);
  }
}
