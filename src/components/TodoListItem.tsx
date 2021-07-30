import { DBDocument } from "../utilities/database";

export interface ITodoListItem {
    done: boolean;
    text: string;
}

interface ITodoListItemProps {
    item: DBDocument<ITodoListItem>;
    mutateData: (_id: string, mutation: any) => Promise<void>;
    getOne: (id: string) => DBDocument<ITodoListItem> | null;
}

function TodoListItem({ item, mutateData, getOne }: ITodoListItemProps) {
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

    return (
        <li>
            <input type="checkbox" checked={item.done} onChange={(e) => toggleData(item._id, item.done, e.target)} />
            <span>{item.text}</span>
        </li>
    );
}

export default TodoListItem;