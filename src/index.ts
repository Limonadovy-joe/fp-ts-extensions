import * as path from 'path';
import {ReaderIOEither} from './ReaderIOEither'
import {right} from 'fp-ts/lib/Either';

console.log(process.env);
console.log( '__dirname join', path.join(__dirname, '..'));
console.log( '__dirname normalize', path.normalize(path.join(__dirname, '..')));

export const decodeData: (data: string) => ReaderIOEither<{decoder: boolean}, Error, string> = (data) => ({decoder}) => {
console.log('decodeData', 'data', data, 'decoder', decoder);
return () => right<Error, string>(data);
} 

decodeData('{data: [1,2,3,5]}');