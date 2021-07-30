import { Fragment } from "react";
import useOrbitDb from "../hooks/orbit-db";
import Controls from "./Controls";
import TodoListItem, { ITodoListItem } from "./TodoListItem";

interface IDatabaseProps {
    address: string;
}

function Database({ address }: IDatabaseProps) {
    const { addData, data, getData, connectedAddress, dropDb, getOne, mutateData } = useOrbitDb<ITodoListItem>(address);

    return (
        <div className="App">
            {
                connectedAddress ?
                    <Fragment>
                        <div><b>Connected To: </b> <code>{connectedAddress}</code></div>
                        <br />
                        {data.length < 1 ?
                            <p>No data yet!</p> :
                            <div className="todo-container">
                                <ul id="list">
                                    {data.sort((a, b) => parseInt(a._id.split('/')[1]) - parseInt(b._id.split('/')[1])).map((i) => <TodoListItem key={i._id} item={i} mutateData={mutateData} getOne={getOne} />)}
                                </ul>
                            </div>
                        }
                        <br />
                        <Controls getData={getData} dropDb={dropDb} addData={addData} />
                    </Fragment>
                    :
                    <p><b>Connecting...</b></p>
            }
        </div>
    );
}

export default Database;