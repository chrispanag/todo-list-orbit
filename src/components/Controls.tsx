import { useState } from "react";
import { ITodoListItem } from "./TodoListItem";

interface IControlsProps {
    getData: () => void;
    dropDb: () => void;
    addData: (data: ITodoListItem) => Promise<void>;
}

function Controls({ getData, dropDb, addData }: IControlsProps) {
    const [newData, setNewData] = useState<string>("");

    const addATodo = () => {
        if (newData.length < 1) {
            return;
        }

        addData({ text: newData, done: false });
        setNewData("");
    }

    return (
        <div className="Controls">
            <div className="Input" style={{ marginTop: '10px' }}>
                <input onChange={(e) => setNewData(e.target.value)} value={newData} />
                <button onClick={addATodo} disabled={newData.length < 1}>Add Data</button>
            </div>
            <div className="OtherControls" style={{ marginTop: '10px' }}>
                <button onClick={getData}>Get Data</button>
                <button onClick={dropDb}>Drop Database</button>
            </div>
        </div>
    )
}

export default Controls;