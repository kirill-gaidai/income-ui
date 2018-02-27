import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../models/category.model';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit, OnDestroy {

  private id: number;

  public categoryEditForm: FormGroup;

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.initForm(null);
    this.id = this.activatedRoute.snapshot.params['id'] ? +this.activatedRoute.snapshot.params['id'] : null;
    if (this.id != null) {
      this.categoryService.get(this.id).subscribe((category: Category) => this.initForm(category));
    }
  }

  private initForm(category: Category): void {
    this.categoryEditForm = new FormGroup({
      'id': new FormControl(category == null ? null : category.id,
        []),
      'sort': new FormControl(category == null ? null : category.sort,
        [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      'title': new FormControl(category == null ? null : category.title,
        [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
    });
  }

  public ngOnDestroy(): void {
  }

  public doOnBtSaveClick(): void {
    if (this.id === null) {
      this.categoryService.create(new Category(
        +this.categoryEditForm.get('id').value,
        this.categoryEditForm.get('sort').value,
        this.categoryEditForm.get('title').value
      )).subscribe((category: Category) => {
        this.categoryService.categoriesChangedSubject.next();
        this.router.navigate(['../', category.id], {relativeTo: this.activatedRoute});
      });
    } else {
      this.categoryService.update(new Category(
        +this.categoryEditForm.get('id').value,
        this.categoryEditForm.get('sort').value,
        this.categoryEditForm.get('title').value
      )).subscribe((category: Category) => {
        this.categoryService.categoriesChangedSubject.next();
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      });
    }
  }

  public doOnBtCancelClick(): void {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

}
