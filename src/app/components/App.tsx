import * as React from 'react';
import Homepage from '../../components/Homepage';
import BaseVariant from '../../components/BaseVariant';
import '../styles/ui.css';
import {useEffect} from 'react';
import {handleEvent} from '../uiMessageHandler';

declare function require(path: string): any;

const App = ({}) => {
    let [page, setPage] = React.useState('HomePage');
    useEffect(() => {
        handleEvent('creationComplete', (_) => {
            setPage('BaseVariant');
        });
    }, []);

    if (page === 'HomePage') {
        return (
            <div>
                {' '}
                <Homepage />{' '}
            </div>
        );
    } else if (page === 'BaseVariant') {
        return (
            <div>
                {' '}
                <BaseVariant />{' '}
            </div>
        );
    }
};

export default App;
