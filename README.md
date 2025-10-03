<<<<<<< HEAD
# DoubleJumpFlight

Minecraft Bedrock behavior pack with TypeScript support.
=======
# DoubleJumpFlight (Minecraft Bedrock Add‑on)

🚀 Toggle flight in survival by using a feather!  
This behavior pack lets players double‑tap jump to enable hover-style flight — perfect for training, clutching, or fall safety.

## Features
- 🪶 Double jump to toggle flight ON/OFF
- 🛬 Auto‑disables when grounded
- 🧠 Per‑player flight state
- ⚙️ Written in TypeScript, compiled to JavaScript

## Installation
1. Download the latest `.mcpack` from [Releases](https://github.com/PigStyDev/double-jump-flight-bedrock/releases)
2. Open it on your device (Windows, iPad, Android, etc.)
3. Enable the behavior pack in your world settings

## Build from source
```bash
npm install
npm run build
powershell Compress-Archive -Path behavior_packs/DoubleJumpFlight_BP/* -DestinationPath DoubleJumpFlight.zip -Force
rename DoubleJumpFlight.zip DoubleJumpFlight.mcpack
>>>>>>> 4e7cef7804455d923ad9152119ad6daa702d9ec6
