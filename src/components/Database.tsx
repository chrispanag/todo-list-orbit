import useOrbitDb from "../hooks/orbit-db";
import { DatabaseInstantiationType } from "../utilities/database";
import Controls from "./Controls";
import TodoListItem, { ITodoListItem } from "./TodoListItem";

interface IDatabaseProps {
    address: string;
    type: DatabaseInstantiationType;
}

function Database({ address, type }: IDatabaseProps) {
    const { addData, data, getData, connectedAddress, dropDb, getOne, mutateData } = useOrbitDb<ITodoListItem>(address, type);

    return (
        <div className="App">
            <div><b>Address:</b> {connectedAddress}</div>
            <br />
            <div>----</div>
            {data.map((i) => <TodoListItem key={i._id} item={i} mutateData={mutateData} getOne={getOne} />)}
            <br />
            <div>----</div>
            <Controls getData={getData} dropDb={dropDb} addData={addData} />
        </div>
    );
}

export default Database;