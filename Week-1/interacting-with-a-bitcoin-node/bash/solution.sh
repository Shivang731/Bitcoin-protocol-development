#!/bin/bash
set -e

RPC_USER="alice"
RPC_PASSWORD="password"
RPC_PORT=18443
RPC_URL="http://127.0.0.1:${RPC_PORT}"

rpc() {
  curl -s --user "${RPC_USER}:${RPC_PASSWORD}" \
    --data-binary "{\"jsonrpc\":\"1.0\",\"id\":\"sob\",\"method\":\"$1\",\"params\":$2}" \
    -H 'content-type: text/plain;' \
    "${RPC_URL}"
}

# Create wallet (ignore if exists)
rpc createwallet "[\"testwallet\"]" >/dev/null || true

# Get address
ADDR=$(rpc getnewaddress "[]" | jq -r '.result')

# Mine enough blocks (>=100 BTC spendable)
rpc generatetoaddress "[201, \"${ADDR}\"]" >/dev/null

# OP_RETURN message
MSG_HEX=$(echo -n "We are all Satoshi!!" | xxd -p -c 256)

# Create raw tx
RAW_TX=$(rpc createrawtransaction \
  "[[], {\"bcrt1qq2yshcmzdlznnpxx258xswqlmqcxjs4dssfxt2\":100, \"data\":\"${MSG_HEX}\"}]" \
  | jq -r '.result')

# Fund tx — 21 sats/vB = 0.00021 BTC/kvB
FUNDED_TX=$(rpc fundrawtransaction \
  "[\"${RAW_TX}\", {\"fee_rate\":0.00021}]" | jq -r '.result.hex')

# Sign
SIGNED_TX=$(rpc signrawtransactionwithwallet \
  "[\"${FUNDED_TX}\"]" | jq -r '.result.hex')

# Broadcast
TXID=$(rpc sendrawtransaction "[\"${SIGNED_TX}\"]" | jq -r '.result')

# Write for autograder
echo "${TXID}" > out.txt
