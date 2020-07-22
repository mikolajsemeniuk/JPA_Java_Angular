import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

import { Country } from 'src/app/common/country'
import { State } from 'src/app/common/state'
import { map } from 'rxjs/operators'



@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl : string = 'http://localhost:8080/api/countries'
  private statesUrl = 'http://localhost:8080/api/states'

  constructor(
    private httpClient: HttpClient
  ) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(res => res._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {

    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );

  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

  	let data: number[] = []

  	for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
  		data.push(theMonth)
  	}
  	// needed for return an observable object
  	return of(data)

  }

  getCredditCardYears(): Observable<number[]> {

  	let data: number[] = []


  	const startYear: number = new Date().getFullYear()
  	const endYear: number = startYear + 10


  	for (let year = startYear; year <= endYear; year++) {
  		data.push(year)
  	}

  	return of(data)
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[]
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[]
  }
}
