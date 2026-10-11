Hooks.on("init", () => {
	game.settings.register("world-scripter", "scripts", {
		name: "WORLD_SCRIPTER.SETTINGS.scripts.name",
		hint: "WORLD_SCRIPTER.SETTINGS.scripts.hint",
		scope: "world",
		config: false,
		type: new foundry.data.fields.JavaScriptField({ async: true, initial: "" }),
		requiresReload: true,
	});
	const scripts = game.settings.get("world-scripter", "scripts");
	game.settings.register("world-scripter", "init", {
		name: "WORLD_SCRIPTER.SETTINGS.init.name",
		hint: "",
		scope: "world",
		config: true,
		type: new foundry.data.fields.JavaScriptField({ async: true, initial: scripts || "" }),
		requiresReload: true,
	});
	game.settings.register("world-scripter", "i18ninit", {
		name: "WORLD_SCRIPTER.SETTINGS.i18ninit.name",
		hint: "",
		scope: "world",
		config: true,
		type: new foundry.data.fields.JavaScriptField({ async: true, initial: "" }),
		requiresReload: true,
	});
	game.settings.register("world-scripter", "setup", {
		name: "WORLD_SCRIPTER.SETTINGS.setup.name",
		hint: "",
		scope: "world",
		config: true,
		type: new foundry.data.fields.JavaScriptField({ async: true, initial: "" }),
		requiresReload: true,
	});
	game.settings.register("world-scripter", "ready", {
		name: "WORLD_SCRIPTER.SETTINGS.ready.name",
		hint: "",
		scope: "world",
		config: true,
		type: new foundry.data.fields.JavaScriptField({ async: true, initial: "" }),
		requiresReload: true,
	});
	try {
		return new foundry.utils.AsyncFunction(game.settings.get("world-scripter", "init"))();
	} catch (err) {
		ui.notifications.error("WORLD_SCRIPTER.ERROR.Syntax", { localize: true });
	}
});

Hooks.on("i18ninit", () => {
	try {
		return new foundry.utils.AsyncFunction(game.settings.get("world-scripter", "i18ninit"))();
	} catch (err) {
		ui.notifications.error("WORLD_SCRIPTER.ERROR.Syntax", { localize: true });
	}
})

Hooks.on("setup", () => {
	try {
		return new foundry.utils.AsyncFunction(game.settings.get("world-scripter", "setup"))();
	} catch (err) {
		ui.notifications.error("WORLD_SCRIPTER.ERROR.Syntax", { localize: true });
	}
})

Hooks.on("ready", () => {
	try {
		return new foundry.utils.AsyncFunction(game.settings.get("world-scripter", "ready"))();
	} catch (err) {
		ui.notifications.error("WORLD_SCRIPTER.ERROR.Syntax", { localize: true });
	}
})
