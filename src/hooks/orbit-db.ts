import { useEffect, useState } from "react";
import OrbitDB from "orbit-db";
import DocumentStore from "orbit-db-docstore";

import initOrbitInstance, { DBDocument, DBFields } from "../utilities/database";

export default function useOrbitDb<T>(address: string) {
  const [orbitDb, setOrbitDb] = useState<DocumentStore<DBDocument<T>> | null>(
    null
  );
  const [data, setData] = useState<Array<DBDocument<T>>>([]);

  // Query all data
  const getData = () => {
    if (!orbitDb) {
      setData([]);
      return;
    }

    const newData = orbitDb.query((s) => true);
    setData([...newData]);
  };

  // Get one item by id
  const getOne = (_id: string) => {
    if (!orbitDb) {
      return null;
    }

    const data = orbitDb.get(_id);
    if (data.length < 1) {
      return null;
    }

    return data[0];
  };

  // Edit a document
  const mutateData = async (
    _id: string,
    mutation: Partial<Omit<T, keyof DBFields>>
  ) => {
    if (!orbitDb) {
      return;
    }

    const doc = getOne(_id);
    if (!doc) {
      return;
    }

    const newData = { ...doc, ...mutation };
    await orbitDb.put(newData);
    getData();
  };

  // Add new item to the database
  const addData = async (obj: T) => {
    if (!orbitDb) {
      return;
    }

    await orbitDb.put({
      ...obj,
      _id: orbitDb.identity.id + "/" + Date.now(), // Create a unique id
    });
    getData();
  };

  // Delete this database
  const dropDb = () => {
    if (!orbitDb) {
      return;
    }
    orbitDb.drop();
  };

  // Initialize replication event listeners
  useEffect(() => {
    if (!orbitDb) {
      return;
    }

    orbitDb.events.on("replicated", () => {
      if (!orbitDb) {
        return;
      }
      console.log("replicated");
      const newData = orbitDb.query(() => true);
      setData([...newData]);
    });
  }, [orbitDb]);

  // Initialize the database
  useEffect(() => {
    async function init() {
      const db = await initOrbitInstance<DBDocument<T>>(
        address,
        OrbitDB.isValidAddress(address) ? "open" : "create"
      );
      setOrbitDb(db);
    }

    init();
  }, [address]);

  return {
    getData,
    addData,
    data,
    connectedAddress: orbitDb?.address.toString(),
    dropDb,
    mutateData,
    getOne,
  };
}
