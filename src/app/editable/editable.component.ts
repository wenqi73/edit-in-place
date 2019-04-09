import { Component, OnInit, ContentChild, ElementRef, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ViewModeDirective } from './view-mode.directive';
import { EditModeDirective } from './edit-mode.directive';
import { fromEvent, Subject, BehaviorSubject } from 'rxjs';
import { filter, takeUntil, switchMapTo } from 'rxjs/operators';

@Component({
  selector: 'editable',
  template: `<ng-container *ngTemplateOutlet="currentView"></ng-container>`,
  styles: []
})
export class EditableComponent implements OnInit, OnDestroy {
  mode: 'view' | 'edit' = 'edit';
  mode$ = new BehaviorSubject<string>('view');
  currentView: TemplateRef<any>;
  destroy$ = new Subject();

  @Output() update: EventEmitter<string> = new EventEmitter();
  @ContentChild(ViewModeDirective) viewModeTpl: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl: EditModeDirective;

  constructor(private el: ElementRef) { }

  subscribeView() {
    this.mode$.asObservable().subscribe(mode => {
      this.currentView = mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
    });
  }

  ngOnInit() {
    this.subscribeView();

    const dblclick$ = fromEvent(this.el.nativeElement, 'dblclick').pipe(
      takeUntil(this.destroy$)
    );
    dblclick$.subscribe(event => {
      this.mode$.next('edit');
    });

    const clickOutside$ = fromEvent(document, 'click').pipe(
      filter(event => !this.el.nativeElement.contains(event.target)),
      takeUntil(this.destroy$)
    );

    dblclick$.pipe(switchMapTo(clickOutside$)).subscribe(event => {
      this.update.emit('whatever');
      this.mode$.next('view');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
