import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Category} from '../../../models/category.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent implements OnInit, OnDestroy {

  private category: Category;
  private activatedRouteParamsSubscription: Subscription;

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.category = new Category(null, null, null);
    this.activatedRouteParamsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.categoryService.get(+params['id']).subscribe((category: Category) => this.category = category);
    });
  }

  public ngOnDestroy(): void {
    this.activatedRouteParamsSubscription.unsubscribe();
  }

  public doOnBtEditClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  public doOnBtDeleteClick(): void {
    this.categoryService.delete(this.category.id).subscribe(() => {
      this.categoryService.categoriesChangedSubject.next();
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    });
  }

}
