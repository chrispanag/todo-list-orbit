import { create } from "ipfs";
import OrbitDB from "orbit-db";
import DocumentStore from "orbit-db-docstore";

import { useEffect, useState } from "react";

const ipfsSettings = {
  repo: "./orbitdb",
  config: {
    Addresses: {
      Swarm: [
        "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/"
      ],
    },
  },
};

export type DBDocument<T> = T & { _id: string };

function createOrOpenDatabase<T extends { _id: string }>(
  type: "create" | "open",
  address: string,
  orbit: OrbitDB
) {
  switch (type) {
    case "create":
      return orbit.docs<T>(address, {
        accessController: { write: ["*"] },
      });
    case "open":
      return orbit.open(address, { type: "docstore" }) as Promise<
        DocumentStore<T>
      >;
    default:
      throw Error("Unkown type!");
  }
}

async function initOrbitInstance<T extends { _id: string }>(
  address: string,
  type: "create" | "open"
) {
  try {
    const ipfs = await create(ipfsSettings);
    const orbit = await OrbitDB.createInstance(ipfs as any);

    const db = await createOrOpenDatabase<T>(type, address, orbit);

    await db.load();

    db.events.on("peer", (peer) => console.log("Connected: " + peer));

    return db;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export default function useOrbitDb<T>(
  address: string,
  type: "create" | "open" = "create"
) {
  const [orbitDb, setOrbitDb] = useState<DocumentStore<DBDocument<T>> | null>(
    null
  );
  const [data, setData] = useState<DBDocument<T>[]>([]);

  const getData = () => {
    if (!orbitDb) {
      setData([]);
      return;
    }

    const newData = orbitDb.query((s) => true);
    console.log(newData);
    setData([...newData]);
  };

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

  // TODO: Remove any
  const mutateData = async (_id: string, mutation: any) => {
    if (!orbitDb) {
      return;
    }

    const doc = getOne(_id);
    if (!doc) {
      return;
    }

    const { _id: _, ...rest } = doc;

    const newData = Object.assign(rest, mutation);
    await orbitDb.put({ _id, ...newData });
    getData();
  };

  const dropDb = () => {
    if (!orbitDb) {
      return;
    }
    orbitDb.drop();
  };

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

  useEffect(() => {
    async function init() {
      const db = await initOrbitInstance<DBDocument<T>>(address, type);
      setOrbitDb(db);
    }

    init();
  }, [address, type]);

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
