import { CircleTransfer, wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner, getEnv } from './helpers/helpers';

(async function () {
	// Initialize the Wormhole object for the Testnet environment and add supported chains (evm and solana)
	const wh = await wormhole('Testnet', [evm, solana]);

	// Grab chain Contexts -- these hold a reference to a cached rpc client
	const rcvChain = wh.getChain('Solana');

	// Get signer from local key
	const destination = await getSigner(rcvChain);

	const timeout = 60 * 1000; // Timeout in milliseconds (60 seconds)

	// Rebuild the transfer from the source txid
	const xfer = await CircleTransfer.from(
		wh,
		{
			chain: 'Solana',
			txid: getEnv('SOURCE_TXID'),
		},
		timeout
	);

	const dstTxIds = await xfer.completeTransfer(destination.signer);
	console.log('Completed transfer: ', dstTxIds);

	console.log('Circle Transfer status: ', xfer);

	process.exit(0);
})();
