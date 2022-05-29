import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TOP_BASE_CURRENCY, BOTTOM_BASE_CURRENCY, CurrencyService } from '../currency.service';
import { ICurrency } from '../models/currency.module';
import { IRate } from '../models/rate.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  currencies: Array<ICurrency>;

  /* top */
  topSelectedCurrency: ICurrency;
  topValue: number;

  /* bottom */
  bottomSelectedCurrency: ICurrency;
  bottomValue: number;

  subscription: Subscription;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencies = this.currencyService.currencies;
    this.generateCurrenciesData();
    this.topSelectedCurrency = TOP_BASE_CURRENCY;
    this.bottomSelectedCurrency = BOTTOM_BASE_CURRENCY;
  }

  valueInput($event: any, isTop: boolean = false): void {
    let currentValue: number = Number($event.target.value);
    let calculatedValue: number;

    console.log(currentValue)

    calculatedValue = this.currencyService.calculateValue(currentValue, this.topSelectedCurrency, this.bottomSelectedCurrency, isTop);

    if(isTop) {
      this.bottomValue = calculatedValue;
      this.topValue = currentValue;
    } else {
      this.bottomValue = currentValue;
      this.topValue = calculatedValue;
    }

  }

  valueChanged($event: any): void {
    let isValueClear: boolean = $event.detail.value == '';
    if (isValueClear) {
      this.bottomValue = undefined;
      this.topValue = undefined;
    }
  }

  currencyChanged($event: any, isTop: boolean = false): void {
    let currencyNumericCode: number = $event.detail.value;
    let currentValue: number;
    let calculatedValue: number;

    if(isTop) {
      this.topSelectedCurrency = this.currencies.find(el => el.numericCode == currencyNumericCode);
      currentValue = this.bottomValue;
    } else {
      this.bottomSelectedCurrency = this.currencies.find(el => el.numericCode == currencyNumericCode);
      currentValue = this.topValue;
    }

    calculatedValue = this.currencyService.calculateValue(currentValue, this.topSelectedCurrency, this.bottomSelectedCurrency, !isTop);

    isTop ? this.topValue = calculatedValue : this.bottomValue = calculatedValue;
  }

  generateCurrenciesData(): void {
    this.subscription = this.currencyService.getRates().subscribe((res) => {
      this.currencies.forEach((currency: ICurrency) => {
        if(currency.stringCode != 'USD') {

          let foundRate = <IRate>res[currency.stringCode];
          
          currency.name = foundRate.name;
          currency.numericCode = Number(foundRate.numericCode);
          currency.rate = Number(foundRate.rate).toFixed(2);

          /* update rate in base currency */
          if(BOTTOM_BASE_CURRENCY.stringCode == currency['stringCode']) {
            BOTTOM_BASE_CURRENCY.rate = currency.rate;
          }
        }
      });

    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
