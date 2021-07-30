import { useState } from 'react';
import './App.css';
import Connect from './components/Connect';
import Database from './components/Database';


function App() {
    const [address, setAddress] = useState<string | null>(null);

    return (
        address ? <Database address={address} /> : <Connect setAddress={setAddress} />
    )
}

export default App;
