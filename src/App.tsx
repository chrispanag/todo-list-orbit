import { useState } from 'react';
import './App.css';
import Database from './components/Database';

function App() {
    const [address, setAddress] = useState<string | null>(null);
    const [tempAddress, setTempAddress] = useState<string>("");
    const [type, setType] = useState<"create" | "open">("create");

    if (address) {
        return <Database address={address} type={type} />;
    }
    return (
        <div className="App">
            <input onChange={(e) => setTempAddress(e.target.value)} /><button onClick={() => { setType('open'); setAddress(tempAddress); }}>Connect</button><button onClick={() => { setType('create'); setAddress(tempAddress); }}>Create</button>
        </div>
    )
}

export default App;
