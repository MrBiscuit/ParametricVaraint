import * as React from 'react';
import Homepage from '../../components/Homepage';
import '../styles/ui.css';
import {useEffect} from 'react';
import {handleEvent} from '../uiMessageHandler';


declare function require(path: string): any;


const App = ({}) => {
    
    useEffect(() => {
       handleEvent('createVariant',(e) => {

       })
      }, [])
    
    return (
        <div>
            <Homepage/>
        </div>
    );
};

export default App;
