import { create } from "ipfs";
import OrbitDB from "orbit-db";
import DocumentStore from "orbit-db-docstore";

export type DatabaseInstantiationType = "create" | "open";
export type DBFields = { _id: string };
export type DBDocument<T> = T & DBFields;

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
      throw Error(`Unkown type ${type}!`);
  }
}

export default async function initOrbitInstance<T extends DBFields>(
  address: string,
  type: DatabaseInstantiationType
) {
  try {
    const ipfs = await create({
      repo: "./orbitdb-tests-" + Date.now(),
      config: {
        Profiles: "lowpower",
        Discovery: {
          MDNS: {
            Enabled: false,
            Interval: 60,
          },
        },
        Swarm: {
          ConnMgr: {
            LowWater: 50,
            HighWater: 50
          },
        },
        Addresses: {
          Swarm: [
            "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
            "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
            "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/",
          ],
        },
      },
    });
    const orbit = await OrbitDB.createInstance(ipfs);

    const db = await createOrOpenDatabase<T>(type, address, orbit);

    db.events.on("peer", (peer) => console.log("Connected: " + peer));

    await db.load();

    return db;
  } catch (e) {
    throw e;
  }
}
