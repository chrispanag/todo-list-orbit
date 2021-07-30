import { useState } from "react";
import { DatabaseInstantiationType } from "../utilities/database";

function Connect({ setType, setAddress }: { setType: (type: DatabaseInstantiationType) => void; setAddress: (address: string) => void }) {
    const [tempAddress, setTempAddress] = useState<string>("");

    return (
        <div className="App">
            <input onChange={(e) => setTempAddress(e.target.value)} /><button onClick={() => { setType('open'); setAddress(tempAddress); }}>Connect</button><button onClick={() => { setType('create'); setAddress(tempAddress); }}>Create</button>
        </div>
    )
}

export default Connect;