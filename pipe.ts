import {Pipe, PipeTransform} from "angular2/core";

@Pipe({
    name: 'alternateCase'
})
export class AlternateCasePipe implements PipeTransform {
    transform(input: string) {
        let result = '';
        if (input && input.length > 0) {
            for (let i = 0; i < input.length; i ++) {
                let current = input[i];
                if (i % 2 === 0) {
                    current = current.toUpperCase();
                }
                result += current;
            }
        }
        return result;
    }
}