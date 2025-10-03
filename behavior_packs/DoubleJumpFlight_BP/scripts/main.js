import { world, system, Player } from "@minecraft/server";
const flightEnabled = new Map();
const GROUNDED_EXIT_MS = 600;
const UP_FORCE = 0.06;
const FORWARD_FORCE = 0.03;
const groundedSince = new Map();
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
// Toggle flight when using a feather
world.beforeEvents.itemUse.subscribe(ev => {
    const player = ev.source;
    if (!(player instanceof Player))
        return;
    const item = ev.itemStack;
    if (item.typeId !== "minecraft:feather")
        return;
    const newState = !(flightEnabled.get(player.id) ?? false);
    flightEnabled.set(player.id, newState);
    player.sendMessage(newState ? "🚀 Flight ON" : "🛬 Flight OFF");
    groundedSince.delete(player.id);
});
// Flight simulation loop
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const enabled = flightEnabled.get(player.id) ?? false;
        const onGround = player.isOnGround ?? false;
        const now = Date.now();
        if (onGround) {
            const started = groundedSince.get(player.id) ?? now;
            groundedSince.set(player.id, started);
            if (enabled && now - started >= GROUNDED_EXIT_MS) {
                flightEnabled.set(player.id, false);
                player.sendMessage("🛬 Flight OFF (grounded)");
                continue;
            }
        }
        else {
            groundedSince.delete(player.id);
        }
        if (!enabled)
            continue;
        player.applyImpulse({ x: 0, y: UP_FORCE, z: 0 });
        const dir = lookVector(player);
        player.applyImpulse({
            x: dir.x * FORWARD_FORCE,
            y: 0,
            z: dir.z * FORWARD_FORCE,
        });
    }
}, 1);
