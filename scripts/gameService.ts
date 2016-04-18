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
    startTime: Date;
    timeValue$: Observable<any>;

    words: string[] = [];
    separatedData: any[] = [];

    gameData = {
        columnCount: this.columnCount,
        win: false,
    };

    stateData: number[] = this.getStateArray();

    constructor(http: Http) {
        this.isOdd = (this.columnCount*this.rowCount) % 2 === 0? false : true;
        this.startTime = new Date();
        http.get('data.json')
            //.toPromise(Promise) // i like map more
            .map((res: Response) => res.json())
            .subscribe((data: {}[]) => {
                var shuffled = this.shuffleArray(data.words);
                for (let i = 0; i < shuffled.length; i ++) {
                    for (let j = 0; j < 2; j ++) {
                        this.words.push(shuffled[i]);
                    }
                }
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

        this.timeValue$ = new Observable((observer: any) => {
            let interval = setInterval(() => {
                let getTimeString = (currentTime, startTime) => {
                    let numSeconds = Math.floor((currentTime - startTime)/1000);

                    let hourStr = ' hours, ';
                    let minStr = ' minutes, ';
                    let secStr = ' seconds';
                    let hourVal = 0;
                    let minVal = 0;
                    let secVal = 0;
                    if (numSeconds < 60) {
                        secVal = numSeconds;
                    } else if (numSeconds >= 60 && numSeconds < 60*60) {
                        minVal = Math.floor(numSeconds/60);
                        secVal = numSeconds % 60;
                    } else if (numSeconds >= 60*60) {
                        hourVal = Math.floor(numSeconds/(60*60));
                        modVal = numSeconds % (60*60);
                        minVal = Math.floor(modVal/60);
                        secVal = modVal % 60;
                    }
                    return hourVal + hourStr + minVal + minStr + secVal + secStr;
                };
                observer.next(getTimeString(new Date(), this.startTime));
            }, 1000);
            return () => {
                clearInterval(interval);
            }
        })
    }

    getCountArray() {
        let r: number[] = [];
        for (let i = 0; i < this.rowCount; i ++) {
            r.push(i);
        }
        return r;
    }

    reload() {
        console.log("reload: ", this.columnCount, this.rowCount)
        this.startTime = new Date();
        // don't do more than 10x10
        if (this.columnCount > 10) {
            this.columnCount = 10;
        } else if (this.columnCount <= 0) {
            this.columnCount = 4;
        }
        if (this.rowCount > 10) {
            this.rowCount = 10;
        } else if (this.rowCount <= 0) {
            this.rowCount = 4;
        }

        this.isOdd = (this.columnCount*this.rowCount) % 2 === 0? false : true;
        this.matchedCount = 0;
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
        let size = this.isOdd ? this.columnCount*this.rowCount-1 : this.columnCount*this.rowCount;
        let arr = this.words.slice(0, size);
        arr = this.shuffleArray(arr);
        let result = [];
        for (var i = 0; i < this.rowCount; i ++) {
            let sub = [];
            for (var j = i*this.columnCount; j < (i+1)*this.columnCount && j < size; j ++) {
                sub.push({word: arr[j], state: this.stateData[j]});
            }
            // if it is the last row, take off the last block if it's odd
            //if (this.isOdd && i === this.rowCount-1) {
            //    result.push(sub.slice(0,this.columnCount-1));
            //} else {
                result.push(sub);
            //}
        }

        return result;
    }

    wordSelected(elem) {

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

            if (this.last2ndWordSelected && this.last2ndWordSelected.word === this.lastWordSelected.word) {

                this.matchFound = true;
                this.last2ndWordSelected.matched = true;
                this.lastWordSelected.matched = true;
                this.matchedCount += 2;
                if (this.matchedCount === this.columnCount*this.rowCount ||
                    (this.isOdd && this.matchedCount === this.columnCount*this.rowCount-1)) {
                    this.gameData.win = true;
                }
            } else {
                this.matchFound = false;
            }
        }
    }
}