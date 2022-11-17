import { SubstrateEvent } from "@subql/types";
import { Transfer, Account } from "../types";
import { Balance } from "@polkadot/types/interfaces";

export async function handleTransfer(event: SubstrateEvent): Promise<void> {
  // Get data from the event
  // The balances.transfer event has the following payload \[from, to, value\]
  // logger.info(JSON.stringify(event));
  const from = event.event.data[0];
  const to = event.event.data[1];
  const amount = event.event.data[2];
  // logger.info(from + '' +  to + '' + amount);

  // ensure that our account entities exist
  const fromAccount = await Account.get(from.toString().toLowerCase());
  if (!fromAccount) {
    await Account.create({
      id: from.toString().toLowerCase(),
      creationBlock: event.block.block.header.number.toBigInt(),
    }).save();
  }

  const toAccount = await Account.get(to.toString().toLowerCase());
  if (!toAccount) {
    await Account.create({
      id: to.toString().toLowerCase(),
      creationBlock: event.block.block.header.number.toBigInt(),
    }).save();
  }

  // Create the new transfer entity
  const transfer = new Transfer(
    `${event.block.block.header.number.toNumber()}-${event.idx}`
  );
  transfer.blockNumber = event.block.block.header.number.toBigInt();
  transfer.fromId = from.toString().toLowerCase();
  transfer.toId = to.toString().toLowerCase();
  transfer.amount = (amount as Balance).toBigInt();
  await transfer.save();
}
