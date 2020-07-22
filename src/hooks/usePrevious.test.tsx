import {usePrevious} from './usePrevious';
import {renderHook} from '@testing-library/react-hooks'

test('test usePrevious correctly set state', async () => {
    const {result} = renderHook(() =>
        usePrevious('test')
    );
    expect(result.current).toBeUndefined();

    // await waitForNextUpdate();
    // console.log(result.current)
})