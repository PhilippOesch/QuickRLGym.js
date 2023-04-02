import sinon from 'sinon';
import { describe } from 'mocha';
import FileStrategy from '../../RLInterface/FileStrategy';

describe('FileStrategy', function () {
    class TestFileStrategy implements FileStrategy {
        async load(options?: object | undefined): Promise<object> {
            throw new Error('Method not implemented.');
        }
        async save(
            saveObject: object,
            options?: object | undefined
        ): Promise<boolean> {
            throw new Error('Method not implemented.');
        }
    }

    const testFileStrategy = new TestFileStrategy();
    const fileStrategyMock = sinon.mock(testFileStrategy);

    it('mock load method', function () {
        const mockMethod = fileStrategyMock.expects('load');
        mockMethod.exactly(1);
        mockMethod.withArgs({ option1: true });
        mockMethod.returns({ option1: true });
        testFileStrategy.load({ option1: true });
        mockMethod.verify();
    });

    it('mock save method', function () {
        const mockMethod = fileStrategyMock.expects('save');
        mockMethod.exactly(1);
        mockMethod.withArgs({ content: 'abcdef' }, { options2: 12 });
        mockMethod.returns(true);
        testFileStrategy.save({ content: 'abcdef' }, { options2: 12 });
        mockMethod.verify();
    });
});
