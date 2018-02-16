import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Category} from '../../models/category.model';
import {CategoryService} from '../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  private categories: Category[];
  private categoriesChangedSubscription: Subscription;

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.categories = this.categoryService.getList();
    this.categoriesChangedSubscription = this.categoryService.categoriesChangedSubject.subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  public ngOnDestroy(): void {
    this.categoriesChangedSubscription.unsubscribe();
  }

  public doOnBtAddClick(): void {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute});
  }

  public doOnBtRefreshClick(): void {
    this.categories = this.categoryService.getList();
  }

}
