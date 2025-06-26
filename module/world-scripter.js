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

Hooks.on("renderSettingsConfig", (_app, form) => {
	const input = form.querySelector("code-mirror[name='world-scripter.scripts']");

	const hint = `<p class="hint">${game.i18n.localize("WORLD_SCRIPTER.SETTINGS.scripts.hint")}</p>`;
	const div = document.createElement('div');
	div.innerHTML = hint.trim();
	input.parentElement.nextElementSibling.replaceWith(div.firstElementChild)

	// Weird workaround to fix the input's value getting extra indents
	const value = game.settings.get("world-scripter", "scripts");
	const { name: label, type: field } = game.settings.settings.get("world-scripter.scripts");
	const scriptsInput = field.toInput({
		hash: {
			aria: { label },
			elementType: "code-mirror",
			language: "javascript",
		},
		value
	})
	input.replaceWith(scriptsInput);
});