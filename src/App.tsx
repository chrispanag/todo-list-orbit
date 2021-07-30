import { useState } from 'react';
import './App.css';
import Connect from './components/Connect';
import Database from './components/Database';
import { DatabaseInstantiationType } from './utilities/database';


function App() {
    const [address, setAddress] = useState<string | null>(null);
    const [type, setType] = useState<DatabaseInstantiationType>("create");

    return (
        address ? <Database address={address} type={type} /> : <Connect setType={setType} setAddress={setAddress} />
    )
}

export default App;
