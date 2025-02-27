import { toBase64 } from "@cosmjs/encoding";

export async function keplrSignMsg(message:string, chainId: string) {
    const account = await keplr.getKey(chainId);
    const address = account.bech32Address;
    const data = toBase64(new TextEncoder().encode(message))
    const msg = { type: "sign/MsgSignData", value: { signer: address, data } }
    const rs = await keplr.signAmino(chainId, address, {
        chain_id: '',
        account_number: '0',
        sequence: '0',
        fee: { gas: '0', amount: [] },
        msgs: [msg],
        memo: ''
    })
    console.log('keplr signing result:', `${JSON.stringify(rs, null, 2)}`)
    return rs;
}