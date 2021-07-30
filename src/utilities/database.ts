import { create } from "ipfs";
import OrbitDB from "orbit-db";
import DocumentStore from "orbit-db-docstore";

export type DatabaseInstantiationType = "create" | "open";
export type DBFields = { _id: string };
export type DBDocument<T> = T & DBFields;

const ipfsSettings = {
  repo: "./orbitdb",
  config: {
    Addresses: {
      Swarm: [
        "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
        "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/",
      ],
    },
  },
};

function createOrOpenDatabase<T extends DBFields>(
  type: DatabaseInstantiationType,
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

export default async function initOrbitInstance<T extends DBFields>(
  address: string,
  type: DatabaseInstantiationType
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
