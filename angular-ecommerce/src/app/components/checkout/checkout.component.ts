import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service'
import { Country } from 'src/app/common/country'
import { State } from 'src/app/common/state'



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

	checkoutFormGroup: FormGroup

  totalPrice: number = 0
  totalQuantity: number = 0

  creditCardYears: number[] = []
  creditCardMonths: number[] = []

  countries: Country[] = []
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
  	private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService
  ) { }

  ngOnInit(): void {
  	this.checkoutFormGroup = this.formBuilder.group({
  		customer: this.formBuilder.group({
  			firstName: [''],
  			lastName: [''],
  			email: ['']
  		}),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),
  	})

    const startMonth: number = new Date().getMonth() + 1
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
    )

    this.luv2ShopFormService.getCredditCardYears().subscribe(
      data => {
        this.creditCardYears = data
      }
    )

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        this.countries = data
      }
    )

  }

  onSubmit() {
    console.log(`data: `, this.checkoutFormGroup.get('customer').value)
  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset()
    }

  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')

    const currentYear: number = new Date().getFullYear()
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear)

    let startMonth: number

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1
    } else {
      startMonth = 1
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
     )

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

}
