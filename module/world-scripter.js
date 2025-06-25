Hooks.on("init", () => {
	game.settings.register("world-scripter", "scripts", {
		name: "WORLD_SCRIPTER.SETTINGS.scripts.name",
		hint: "WORLD_SCRIPTER.SETTINGS.scripts.hint",
		scope: "world",
		config: true,
		type: new foundry.data.fields.JavaScriptField({ async: true, initial: "" }),
		requiresReload: true,
	});
	try {
		return new foundry.utils.AsyncFunction(game.settings.get("world-scripter", "scripts"))();
	} catch (err) {
		ui.notifications.error("WORLD_SCRIPTER.ERROR.Syntax", { localize: true });
	}
});
