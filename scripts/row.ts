import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Block} from './block.ts';

@Component ({
    selector: 'row',
    templateUrl: 'templates/row.html',
    directives: [Block]
})
export class Row {
    @Input ("blockData") blocks: any;
    @Input ("gameData") gameData: any;

    @Output() blockBubble = new EventEmitter();

    color: string;

    constructor() {
        this.color = 'lavender';
        this.inputValue = '';
        this.textColor = 'blue';
    }

    // is there a way to just bubble the event up without manually doing it?
    blockSelected(elem) {
        this.blockBubble.emit(elem);
    }
}