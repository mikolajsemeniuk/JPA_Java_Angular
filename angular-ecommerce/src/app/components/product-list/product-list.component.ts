import { Component, OnInit } from '@angular/core';

import { ProductService } from 'src/app/services/product.service'
import { CartService } from 'src/app/services/cart.service'

import { Product } from 'src/app/common/product'

import { ActivatedRoute } from '@angular/router';

import { CartItem } from 'src/app/common/cart-item'



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = []
  currentCategoryId: number = 1
  previousCategoryId: number = 1
  searchMode: boolean = false

  // new properties for pagination
  thePageNumber: number = 1
  thePageSize: number = 5
  theTotalElements: number = 0

  previousKeyword: string = null

  constructor(
  	private productService: ProductService,
  	private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
  	this.route.paramMap.subscribe(
  		_ => this.listProducts()
  	)
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')

    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts()
    }
    
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')
    } else {
      this.currentCategoryId = 1
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1
    }

    this.previousCategoryId = this.currentCategoryId

    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`)

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      this.processResult()
    )
  }

  processResult() {
    return data => {
      this.products = data._embedded.products
      this.thePageNumber = data.page.number + 1
      this.thePageSize = data.page.size
      this.theTotalElements = data.page.totalElements
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')

    if (this.previousKeyword != keyword) {
      this.thePageNumber = 1
    }

    this.previousKeyword = keyword

    console.log(`keyword: ${keyword}, thePageNumber: ${this.thePageNumber}`)

    this.productService.searchProductsPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      keyword
    ).subscribe(
      this.processResult()
    )
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize
    this.thePageNumber = 1
    this.listProducts()
  }

  addToCart(theProduct: Product) {
    console.log(`Product: ${theProduct.name}, ${theProduct.unitPrice}`)

    const theCartItem = new CartItem(theProduct)

    this.cartService.addToCart(theCartItem)

  }

}
