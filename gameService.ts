import {Injectable} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Headers} from "angular2/http";
//import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";

@Injectable()
export class GameService {

    columnCount: number = 4;
    rowCount: number = 4;
    isOdd: boolean;
    selectedCount: number = 0;
    lastWordSelected: any;
    last2ndWordSelected: any;
    matchFound: boolean = false;
    matchedCount: number = 0;
    time$: Observable<string>;

    words: string[] = [];
    separatedData: any[] = [];

    gameData = {
        columnCount: this.columnCount,
        win: false,
    };

    stateData: number[] = this.getStateArray();

    constructor(http: Http) {
        this.isOdd = (this.columnCount*this.rowCount) % 2 === 0? false : true;
        http.get('data.json')
            //.toPromise(Promise) // i like map more
            .map((res: Response) => res.json())
            .subscribe((data: {}[]) => {
                this.words = data.words;
                this.separatedData = this.getSeparatedData();
            });

        this.time$ = new Observable((observer: any) => {
            let interval = setInterval(() => {
                observer.next(new Date().toLocaleTimeString());
            }, 1000);
            return () => {
                clearInterval(interval);
            }
        });
    }

    getCountArray() {
        let r: number[] = [];
        for (let i = 0; i < this.rowCount; i ++) {
            r.push(i);
        }
        return r;
    }

    reload() {
        console.log("reload: ", this.columnCount, this.rowCount);
        this.isOdd = (this.columnCount*this.rowCount) % 2 === 0? false : true;
        this.stateData = this.getStateArray();
        this.separatedData = this.getSeparatedData();
        this.gameData.win = false;
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    getStateArray() {
        let states = [];
        for (let i = 0; i < this.columnCount*this.rowCount; i ++) {
            states.push(0);
        }
        return states;
    }

    getSeparatedData() {
        console.log('words: ',this.words);
        let arr = this.words.slice(0, this.columnCount*this.rowCount);
        arr = this.shuffleArray(arr);
        let result = [];
        for (var i = 0; i < this.rowCount; i ++) {
            let sub = [];
            for (var j = i*this.columnCount; j < (i+1)*this.columnCount; j ++) {
                sub.push({word: arr[j], state: this.stateData[j]});
            }
            // if it is the last row, take off the last block if it's odd
            if (this.isOdd && i === this.rowCount-1) {
                result.push(sub.slice(0,this.columnCount-1));
            } else {
                result.push(sub);
            }
        }
        console.log(result);
        return result;
    }

    wordSelected(elem) {

        console.log("word selected: ", elem.word);

        this.selectedCount ++;

        if (!this.matchFound && this.last2ndWordSelected && this.lastWordSelected) {
            this.last2ndWordSelected.coverOff = false;
            this.lastWordSelected.coverOff = false;

            this.last2ndWordSelected = null;
            this.lastWordSelected = null;
        }

        this.last2ndWordSelected = this.lastWordSelected;
        this.lastWordSelected = elem;

        if (this.selectedCount % 2 === 0) {
            console.log('pair selected');
            if (this.last2ndWordSelected && this.last2ndWordSelected.word === this.lastWordSelected.word) {
                console.log("matched!!");
                this.matchFound = true;
                this.last2ndWordSelected.matched = true;
                this.lastWordSelected.matched = true;
                this.matchedCount += 2;
                if (this.matchedCount === this.columnCount*this.rowCount ||
                    (this.isOdd && this.matchedCount === this.columnCount*this.rowCount-1)) {
                    this.gameData.win = true;
                }
            } else {
                // cover both up again after a delay
                let _this = this;
                /*timeout = setTimeout(() => {
                    _this.lastWordSelected.coverOff = false;
                    elem.coverOff = false;
                }, 1400);*/ // messes up the game if you really fast in between this delay
                this.matchFound = false;
            }
        } else {
            //debugger;

        }
    }
}