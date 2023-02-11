import sinon from 'sinon';
import { describe } from 'mocha';
import FileStrategy from '../../RLInterface/FileStrategy';

describe('FileStrategy', function () {
    class TestFileStrategy implements FileStrategy {
        async load(options?: object | undefined): Promise<object> {
            return options ? options : {};
        }
        async save(
            saveObject: object,
            options?: object | undefined
        ): Promise<boolean> {
            console.log('save:', saveObject, options)
            return true;
        }
    }

    const testFileStrategy = new TestFileStrategy();

    it('mock load method', function () {
        const fileStrategyMock = sinon.mock(testFileStrategy).expects('load');
        fileStrategyMock.exactly(1);
        fileStrategyMock.withArgs({ option1: true });
        fileStrategyMock.returns({ option1: true });
        testFileStrategy.load({ option1: true });
    });

    it('mock save method', function () {
        const fileStrategyMock = sinon.mock(testFileStrategy).expects('save');
        fileStrategyMock.exactly(1);
        fileStrategyMock.withArgs({ content: 'abcdef' }, { options2: 12 });
        fileStrategyMock.returns(true);
        testFileStrategy.save({ content: 'abcdef' }, { options2: 12 });
    });
});
