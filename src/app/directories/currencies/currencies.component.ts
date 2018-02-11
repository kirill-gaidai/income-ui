import {Component, OnInit} from '@angular/core';
import {Currency} from '../../models/currency.model';
import {CurrencyService} from '../../services/currency.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

  private currencies: Currency[];

  constructor(private currenciesService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.currencies = this.currenciesService.getList();
  }

  doOnBtAddClick(): void {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute});
  }

}
