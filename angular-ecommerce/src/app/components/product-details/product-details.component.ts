import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product'

import { ProductService } from 'src/app/services/product.service'
import { ActivatedRoute } from '@angular/router'
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product()

  constructor(
  	private productService: ProductService,
	  private route: ActivatedRoute,
	  private cartService: CartService
  ) { }

  ngOnInit(): void {
  	this.route.paramMap.subscribe(
  		_ => {
  			this.handleProductDetails()
  		}
  	)
  }

  handleProductDetails() {
  	// by using plus we convert it to string
  	const productId: number = +this.route.snapshot.paramMap.get('id')

  	this.productService.getProduct(productId).subscribe(
  		res => {
  			console.log(res)
  			this.product = res
  		},
  		err => {

  		}
  	)
  }

  addToCart() {
	  console.log('adding to cart: ', this.product.name, ', price: ' ,this.product.unitPrice)

	  const theCartItem = new CartItem(this.product)

	  this.cartService.addToCart(theCartItem)
  }

}
