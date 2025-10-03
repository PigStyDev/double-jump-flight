import { world, system } from "@minecraft/server";
const DOUBLE_TAP_WINDOW_MS = 2000;
const flightEnabled = new Map();
const lastJumpTime = new Map();
const groundedSince = new Map();
const UP_FORCE = 0.06;
const FORWARD_FORCE = 0.03;
const GROUNDED_EXIT_MS = 600;
function lookVector(player) {
    const rot = player.getRotation();
    const pitch = (rot.x ?? 0) * Math.PI / 180;
    const yaw = (rot.y ?? 0) * Math.PI / 180;
    return {
        x: -Math.sin(yaw) * Math.cos(pitch),
        y: -Math.sin(pitch),
        z: Math.cos(yaw) * Math.cos(pitch),
    };
}
// Detect jump by watching ground → air transitions
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const wasGrounded = groundedSince.get(player.id) ?? 1;
        const onGround = player.isOnGround ?? false;
        if (onGround) {
            groundedSince.set(player.id, 1);
        }
        else {
            // If they were grounded last tick, this is a jump
            if (wasGrounded === 1) {
                const now = Date.now();
                const last = lastJumpTime.get(player.id) ?? 0;
                if (now - last <= DOUBLE_TAP_WINDOW_MS) {
                    const newState = !(flightEnabled.get(player.id) ?? false);
                    flightEnabled.set(player.id, newState);
                    player.sendMessage(newState ? "🚀 Flight ON" : "🛬 Flight OFF");
                }
                lastJumpTime.set(player.id, now);
            }
            groundedSince.set(player.id, 0);
        }
    }
}, 1);
// Apply flight impulses if enabled
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!(flightEnabled.get(player.id) ?? false))
            continue;
        // Auto-disable if grounded too long
        if (player.isOnGround) {
            flightEnabled.set(player.id, false);
            player.sendMessage("🛬 Flight OFF (grounded)");
            continue;
        }
        // Apply hover + forward drift
        player.applyImpulse({ x: 0, y: UP_FORCE, z: 0 });
        const dir = lookVector(player);
        player.applyImpulse({
            x: dir.x * FORWARD_FORCE,
            y: 0,
            z: dir.z * FORWARD_FORCE,
        });
    }
}, 1);
