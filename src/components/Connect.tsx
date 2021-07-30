import OrbitDB from "orbit-db";
import { useState } from "react";

interface IConnectProps {
    setAddress: (address: string) => void
}

function Connect({ setAddress }: IConnectProps) {
    const [tempAddress, setTempAddress] = useState<string>("");

    const isValidAddress = OrbitDB.isValidAddress(tempAddress);
    const addressIsTyped = tempAddress.length > 0;

    return (
        <div className="App">
            <h1>Decentralized TODO List Application</h1>
            <div>
                <p>
                    <b>Type a valid OrbitDB address to connect to, or type a new database name to create a new one.</b>
                </p>
                <p>
                    eg: <code>test-database</code> or <code>/orbitdb/zdpuAqUgx1w6CAv159Sz4YsQVMPyQy6GhPsLD3QHaqa1oMKw5/test-database</code>
                </p>
            </div>
            <div>
                <div><input style={{ width: '50%' }} onChange={(e) => setTempAddress(e.target.value)} /></div>
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <button style={{ width: '25%', height: '30px' }} disabled={!addressIsTyped} onClick={() => { setAddress(tempAddress); }}>
                        {!addressIsTyped ? <b>Connect or Create</b> : (isValidAddress ? <b>Connect</b> : <b>Create</b>)}
                    </button>
                </div>
                {addressIsTyped ? (isValidAddress ? <div>This is a valid OrbitDb Address, hit "Connect" to join.</div> : <div>This is not a valid OrbitDb Address, a new database with the name <b>{tempAddress}</b> will be created.</div>) : null}
            </div>
        </div>
    )
}

export default Connect;