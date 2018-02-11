import {Component, OnInit} from '@angular/core';
import {Currency} from '../../models/currency.model';
import {CurrencyService} from '../../services/currency.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

  private currencies: Currency[];

  constructor(private currenciesService: CurrencyService) {
  }

  ngOnInit() {
    this.currencies = this.currenciesService.getList();
  }

}
