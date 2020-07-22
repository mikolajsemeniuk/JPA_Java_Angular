import { Injectable } from '@angular/core';
// Http module
import { HttpClient } from '@angular/common/http'
// Product Class
import { Product } from '../common/product'
import { ProductCategory } from '../common/product-category'
// Observable
import { Observable } from 'rxjs'
// map
import { map } from 'rxjs/operators'




@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products' // ?size=100'

  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProducts> {

    console.log(`from service thePage: ${thePage}, thePageSize: ${thePageSize}, theCategoryId: ${theCategoryId}`)

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl)

  }

  // Get response from Spring BackEnd
  getProductList(theCategoryId: number): Observable<Product[]> {

  	const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

  	return this.getProducts(searchUrl)
  }

  searchProducts(name: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${name}`

    return this.getProducts(searchUrl)
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(
        res => res._embedded.products
      )
    )
  }

  getProductCategories(): Observable<ProductCategory[]> {
  	return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
  		map(
  			res => res._embedded.productCategory
  		)
  	)
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`

    return this.httpClient.get<Product>(productUrl)
  }

  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string
   ): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` +
    `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl)
  }

}

// Unwrap the JSON from Spring Data Rest _embedded entry
interface GetResponseProducts {
	_embedded: {
		products: Product[]
	},
  page: {
    size: number,
    totalElements: number,
    number: number
  }
}

interface GetResponseProductCategory {
	_embedded: {
		productCategory: ProductCategory[]
	}
}