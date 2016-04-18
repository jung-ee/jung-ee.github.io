import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component ({
    selector: 'block',
    template: `<div class="block" style="background-color:{{color}}" [class.matched]="matched" [attr.data-word]="word"><div class="block-cover" [class.cover-off]="coverOff" (click)="doClick()"></div><div class="word-text" [class.stripes]="win">{{word}}</div></div>`
})
export class Block implements OnChanges {
    @Input ("word") word: any;
    @Input ("state") state: any;
    @Input ("win") win: boolean;
    @Output() selectBlock = new EventEmitter();
    color: string;
    coverOff: boolean = false;
    matched: boolean = false;

    constructor() {
        this.color = 'lightyellow';

        this.doClick = function() {
            this.coverOff = !this.coverOff;
            this.selectBlock.emit(this);
        }
    }
}