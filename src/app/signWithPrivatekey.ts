import { Secp256k1, sha256 } from "@cosmjs/crypto";
import { toBase64 } from "@cosmjs/encoding"
import { encodeSecp256k1Signature, makeSignDoc,  } from "@cosmjs/amino";
import { escapeHTML, sortedJsonByKeyStringify } from "@keplr-wallet/common";

export async function signAdr36Message(signerAddress: string, privateKey: string, message: string) {
    // Convert the private key to a Uint8Array
    const privKey = Uint8Array.from(Buffer.from(privateKey, "hex"));
    const pair = await Secp256k1.makeKeypair(privKey);
    let { pubkey }  = pair
    pubkey = Secp256k1.compressPubkey(pubkey)

    // Create the ADR-36 sign doc
    const signDoc = makeSignDoc(
        [
            {
                type: "sign/MsgSignData",
                value: {
                    signer: signerAddress,
                    data: toBase64(new TextEncoder().encode(message)),
                },
            },
        ], // msg
        { gas: '0', amount: [] }, // no fee
        '', // no chain id 
        '', // memo empty
        '0', // account number 0
        '0', // sequence 0
    );

    /**
     * start 
     * 以下的两步是为了和 keplr的签名结果完全一致
     * 没有这两步，签出来的signature跟keplr不一样，但是理论上应该不影响验签，没有测试过
     */
    // sort json by key and convert to string
    const sortedSignDocJson = sortedJsonByKeyStringify(signDoc);
    // Escapes <,>,& in string
    const escapedSignDocString = escapeHTML(sortedSignDocJson);
    /**
     * end
     */



    // Hash the sign doc with SHA256
    const serializedSignDoc = sha256(Buffer.from(escapedSignDocString))

    // Sign the hash
    const signature = (await Secp256k1.createSignature(serializedSignDoc, privKey)).toFixedLength().slice(0, -1);

    // Encode the signature in Amino format
    const aminoSignature = encodeSecp256k1Signature(pubkey, signature);

    const rs = {
        signature: aminoSignature,
        signed: signDoc
    };

    console.log('sign rs', JSON.stringify(rs, null, 2))

    return rs

}