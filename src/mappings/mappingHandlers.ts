import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {Transfer, Account} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleTransfer(event: SubstrateEvent): Promise<void> {
    // Get data from the event
    // The balances.transfer event has the following payload \[from, to, value\]
    
    const from = event.event.data[0];
    const to = event.event.data[1];
    const amount = event.event.data[2];
    
    logger.info(from, to amount);
    
    // ensure that our account entities exist
    const fromAccount = await Account.get(from.toString());
    if (!fromAccount) {
        await new Account(from.toString()).save();
    }
    
    const toAccount = await Account.get(to.toString());
    if (!toAccount) {
        await new Account(to.toString()).save();
    }
    
    // Create the new transfer entity
    const transfer = new Transfer(
        `${event.block.block.header.number.toNumber()}-${event.idx}`,
    );
    transfer.fromId = from.toString();
    transfer.toId = to.toString();
    transfer.amount = (amount as Balance).toBigInt();
    await transfer.save();
}
