import { create } from "ipfs";
import OrbitDB from "orbit-db";
import DocumentStore from "orbit-db-docstore";

import { useCallback, useEffect, useState } from "react";

const ipfsSettings = {
  repo: "./orbitdb",
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // '/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star',
        // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        // Use IPFS dev webrtc signal server
        "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/",
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ],
    },
  },
};

async function initOrbitInstance(address: string, type: "create" | "open") {
  try {
    const ipfs = await create(ipfsSettings);
    const orbit = await OrbitDB.createInstance(ipfs as any);
    let db: DocumentStore<any>;
    if (type === "create") {
      db = await orbit.docs(address, {
        accessController: { write: ["*"] },
      });
    } else {
      db = (await orbit.open(address, {
        type: "docstore",
        sync: true,
      } as IOpenOptions)) as DocumentStore<any>;
    }

    await db.load();

    db.events.on("peer", (peer) => console.log("Connected: " + peer));
    console.log("test");

    return db;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export default function useOrbitDb(
  address: string,
  type: "create" | "open" = "create"
) {
  const [orbitDb, setOrbitDb] = useState<DocumentStore<any> | null>(null);
  const [data, setData] = useState<
    Array<{ text: string; done: boolean; _id: string }>
  >([]);

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

  const mutateData = async (_id: string, mutation: Record<string, any>) => {
    if (!orbitDb) {
      return;
    }

    const data = getOne(_id);
    const newData = Object.assign(data, mutation);
    await orbitDb.put({ _id, ...newData });
    getData();
  };

  const dropDb = () => {
    if (!orbitDb) {
      return;
    }
    orbitDb.drop();
  };

  const addData = async (value: string) => {
    if (!orbitDb) {
      return;
    }

    await orbitDb.put({
      text: value,
      done: false,
      _id: orbitDb.identity.id + "/" + Date.now(),
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
      console.log(newData);
    });
  }, [orbitDb]);

  useEffect(() => {
    async function init() {
      const db = await initOrbitInstance(address, type);
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
