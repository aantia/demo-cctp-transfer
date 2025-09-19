import { wormhole, amount } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner, getEnv } from './helpers/helpers';

(async function () {
	const wh = await wormhole('Testnet', [evm, solana]);

	const sendChain = wh.getChain('Solana');
	const rcvChain = wh.getChain('Ethereum');

	// Get signer from local key
	const source = await getSigner(sendChain);
	const destination = await getSigner(rcvChain);

	// Define the amount of USDC to transfer (in the smallest unit, so 0.1 USDC = 100,000 units assuming 6 decimals)
	const amt = BigInt(getEnv('AMOUNT_USDC')) * 1_000_000n;

	// If set to false the user will have to manually approve the transfer (refer to the circle-manual-transfer.ts file)
	const automatic = true;

	const nativeGas = automatic ? amount.units(amount.parse('0.0', 6)) : 0n;

	const xfer = await wh.circleTransfer(
		amt,
		source.address,
		destination.address,
		automatic,
		undefined,
		nativeGas
	);

	console.log(`Starting Auto Transfer of ${amt} from ${source.address} on ${sendChain.chain} to ${destination.address} on ${rcvChain.chain}`);
	const srcTxids = await xfer.initiateTransfer(source.signer);
	console.log(`Started Transfer: `, srcTxids);

	process.exit(0);
})();
