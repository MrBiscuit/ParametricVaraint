import * as React from 'react';
import Homepage from '../../components/Homepage';
import BaseVariant from '../../components/BaseVariant';
import '../styles/ui.css';
import {useEffect} from 'react';
import {dispatch, handleEvent} from '../uiMessageHandler';
import InspectDiff from '../../components/InspectDiff';
import CreateVariant from '../../components/CreateVariant';
import {TextInputRefValue} from '@plasmicapp/react-web';

declare function require(path: string): any;

const App = ({}) => {
    let [page, setPage] = React.useState('HomePage');
    const addOptionInput = React.useRef<TextInputRefValue>(null);

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
        handleEvent('addOption', (_) => {
            setPage('InspectDiff');
            addOptionInput.current.focus();
        });
        handleEvent('updateDiff', (_) => {
            setPage('InspectDiff');
            dispatch("updateHeight",document.body.scrollHeight) 
        })
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
    } else if (page === 'InspectDiff') {
        return (
            <div>
                <InspectDiff
                    //@ts-ignore
                    valueInput={{
                        props: {
                            ref: addOptionInput,
                            onKeyPress: (e) => {
                                if (e.key == "Enter") {
                                    addOptionInput.current.getInput().blur()
                                    dispatch("addOptionConfirm", {value:addOptionInput.current.getInput().value});
                                  }
                            }
                        },
                       
                    }}
                    confirm={{
                        props:{
                            onClick: () => {
                                dispatch("addOptionConfirm", {value:addOptionInput.current.getInput().value});
                            },
                            
                        }
                    }}
                />
            </div>
        );
    }
};

export default App;
