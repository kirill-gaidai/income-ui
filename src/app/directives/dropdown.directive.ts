import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open')
  private opened = false;

  @HostListener('click')
  public doOnClick(): void {
    this.opened = !this.opened;
  }

}
