import Benchmark from 'benchmark';
import { Utils } from '../../coreLibrary/src';

const suite = new Benchmark.Suite();

const testTensor = Utils.Tensor.Random([4, 5, 6, 7, 8, 9], 22);

const iterations = 100000;

suite
    .add('sum', function () {
        for (let i = 0; i < iterations; i++) {
            testTensor.originalSum;
        }
    })
    .on('cycle', function (event: any) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + suite.filter('fastest').map('name'));
    })
    // run async
    .run({ async: true });
