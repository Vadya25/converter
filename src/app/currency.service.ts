import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICurrency } from './models/currency.module';
import { IRate } from './models/rate.module';

export const TOP_BASE_CURRENCY: ICurrency = {
  name: 'USD',
  numericCode: 840,
  stringCode: 'USD',
  rate: '1',
};
export const BOTTOM_BASE_CURRENCY: ICurrency = {
  name: 'Ukrainian Hryvnia',
  numericCode: 980,
  stringCode: 'uah',
  rate: '',
};

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  public currencies: Array<ICurrency> = [
    {
      name: 'USD',
      stringCode: 'USD',
      numericCode: 840,
      rate: '1',
    },
    {
      name: 'Ukrainian Hryvnia',
      stringCode: 'uah',
      numericCode: 980,
      rate: '',
    },
    {
      name: 'EURO',
      stringCode: 'eur',
      numericCode: 978,
      rate: '',
    },
    {
      name: 'U.K. Pound Sterling',
      stringCode: 'gbp',
      numericCode: 826,
      rate: '',
    },
    {
      name: 'Canadian Dollar',
      stringCode: 'cad',
      numericCode: 124,
      rate: '',
    },
  ];

  constructor(private http: HttpClient) { }

  getRates(): Observable<any> {
    // Base currency euro
    return this.http.get<any>('http://www.floatrates.com/daily/usd.json');
  }

  calculateValue(currentValue: number, topCurrency: ICurrency, bottomCurrency: ICurrency, isTop: boolean): number {

    let topCurrencyIsBase: boolean = topCurrency.rate == '1';
    let bottomCurrencyIsBase: boolean = bottomCurrency.rate == '1';
    let needToCalculateBaseRate: boolean = !topCurrencyIsBase && !bottomCurrencyIsBase;
    let rate: number;

    if(needToCalculateBaseRate) {
      rate = this.findRate(topCurrency, bottomCurrency);
    } else if(isTop) {
      rate = topCurrencyIsBase ? Number(bottomCurrency.rate) : Number(topCurrency.rate);
    } else {
      rate = bottomCurrency.rate == '1' ? Number(topCurrency.rate) : Number(bottomCurrency.rate);
    }

    if(isTop) {
      console.log('rate ', rate)
      let calculatedValue: number = topCurrencyIsBase ? currentValue * rate : currentValue / rate 
      return Number(calculatedValue.toFixed(2));
    
    } else {
      let calculatedValue: number = bottomCurrencyIsBase ? currentValue * rate : currentValue / rate
      return Number(calculatedValue.toFixed(2));
    }

  }

  findRate(currentCurrency: ICurrency, findCurrency: ICurrency): number {
    let baseCurrency = this.currencies.find(el => el.rate === '1');
    return Number(baseCurrency.rate) / Number(currentCurrency.rate) * Number(findCurrency.rate); 
  }


}
