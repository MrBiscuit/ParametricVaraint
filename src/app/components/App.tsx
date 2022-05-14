import * as React from 'react';
import Homepage from '../../components/Homepage';
import BaseVariant from '../../components/BaseVariant';
import '../styles/ui.css';
import {useEffect} from 'react';
import {handleEvent} from '../uiMessageHandler';
import CreateVariant from '../../components/CreateVariant';

declare function require(path: string): any;

const App = ({}) => {
    let [page, setPage] = React.useState('HomePage');
    useEffect(() => {
        handleEvent('empty', (_) => {
            setPage('HomePage');
        });
        handleEvent('creationComplete', (_) => {
            setPage('BaseVariant');
        });
        handleEvent('addVariant', (_) => {
            setPage('CreateVariant');
        });
    }, []);

    if (page === 'HomePage') {
        return (
            <div>
                <Homepage />
            </div>
        );
    } else if (page === 'BaseVariant') {
        return (
            <div>
                <BaseVariant />
            </div>
        );
    } else if (page === 'CreateVariant') {
        return (
            <div>
                <CreateVariant />
            </div>
        );
    }
};

export default App;
