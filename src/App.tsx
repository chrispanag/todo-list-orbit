import useOrbitDb from './orbit-db';
import './App.css';
import { useState } from 'react';


function Database({ address, type }: { address: string, type: "create" | "open" }) {
  const { addData, data, getData, connectedAddress, dropDb, getOne, mutateData } = useOrbitDb(address, type);
  const [newData, setNewData] = useState<string>("");

  const toggleData = (hash: string, state: boolean, target: any) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (value !== state) {
      const data = getOne(hash);
      if (!data) {
        return;
      }

      mutateData(hash, { done: !state });
    }
  };

  const addATodo = () => {
    if (newData.length < 1) {
      return;
    }

    addData(newData);
    setNewData("");
  }

  return (
    <div className="App">
      <div><b>Address:</b> {connectedAddress}</div>
      <br />
      <div>----</div>
      {data.map((i) => <div key={i._id}><span><input type="checkbox" checked={i.done} onChange={(e) => toggleData(i._id, i.done, e.target)} />{i.text}</span></div>)}
      <br />
      <div>----</div>
      <input onChange={(e) => setNewData(e.target.value)} value={newData} />
      <button onClick={addATodo}>Add Data</button>
      <button onClick={getData}>Get Data</button>
      <button onClick={dropDb}>Drop Database</button>
    </div>
  );
}

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [tempAddress, setTempAddress] = useState<string>("");
  const [type, setType] = useState<"create" | "open">("create");

  if (address) {
    return <Database address={address} type={type} />;
  } else {
    return (
      <div className="App">
        <input onChange={(e) => setTempAddress(e.target.value)} /><button onClick={() => { setType('open'); setAddress(tempAddress); }}>Connect</button><button onClick={() => { setType('create'); setAddress(tempAddress); }}>Create</button>
      </div>
    )
  }
}

export default App;
