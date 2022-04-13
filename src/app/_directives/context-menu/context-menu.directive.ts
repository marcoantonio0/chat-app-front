import { Directive, ElementRef, HostListener, ViewChild } from '@angular/core';

@Directive({
  selector: '[contextMenu]'
})
export class ContextMenuDirective {
  @ViewChild('contextMenuWrapper', { static: false }) contextMenuWrapper!: ElementRef<HTMLDivElement>;
  constructor(
    private el: ElementRef
  ) {
  
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: PointerEvent) {
   console.log(this.contextMenuWrapper);
  }

}
