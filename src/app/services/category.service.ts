import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CategoryService implements OnInit, OnDestroy {

  public categoriesChangedSubject: Subject<Category[]> = new Subject<Category[]>();

  private categories: Category[] = [
    new Category(1, '01', 'Перемещение'),
    new Category(2, '02', 'Продукты'),
    new Category(3, '03', 'Хозтовары')
  ];

  constructor() {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Category[] {
    return this.categories.slice();
  }

  public get(id: number): Category {
    for (const category of this.categories) {
      if (id === category.id) {
        return category;
      }
    }
    return null;
  }

  public create(category: Category): Category {
    category.id = this.getNextId();
    this.categories.push(category);
    this.categoriesChangedSubject.next(this.categories);
    return category;
  }

  public update(category: Category): void {
    for (let index = 0; index < this.categories.length; index++) {
      if (category.id === this.categories[index].id) {
        this.categories[index] = category;
        this.categoriesChangedSubject.next(this.categories);
        return;
      }
    }
  }

  public delete(id: number): void {
    for (let index = 0; index < this.categories.length; index++) {
      if (id === this.categories[index].id) {
        this.categories.splice(index, 1);
        this.categoriesChangedSubject.next(this.categories);
        return;
      }
    }
  }

  private getNextId(): number {
    let max = 0;
    this.categories.forEach((category: Category) => {
      if (max < category.id) {
        max = category.id;
      }
    });
    return max + 1;
  }

}
