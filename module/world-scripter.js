const moduleId = "world-scripter";
const settings = "WORLD_SCRIPTER.SETTINGS";
const errors = "WORLD_SCRIPTER.ERRORS";

Hooks.on("init", () => {
	game.settings.register(moduleId, "macroPacks", {
		name: `${settings}.macroPacks.name`,
		hint: `${settings}.macroPacks.hint`,
		scope: "world",
		config: true,
		type: String,
		default: "",
	});

	game.settings.register(moduleId, "scripts", {
		name: `${settings}.scripts.name`,
		hint: `${settings}.scripts.hint`,
		scope: "world",
		config: true,
		type: new foundry.data.fields.JavaScriptField({ async: true, initial: "" }),
		requiresReload: true,
	});

	try {
		return new foundry.utils.AsyncFunction(game.settings.get(moduleId, "scripts"))();
	} catch (err) {
		ui.notifications.error(`${errors}.syntax`, { localize: true });
	}
});

Hooks.on("renderSettingsConfig", (_app, form) => {
	const macroPacksInput = form.querySelector(`input[name="${moduleId}.macroPacks"]`);
	if (macroPacksInput) {
		const macroPacks = game.packs.filter((p) => p.metadata.type === "Macro");
		const selectedPacks = (game.settings.get(moduleId, "macroPacks") || "").split(",").filter(Boolean);

		let checkboxesHtml = macroPacks
			.map((pack) => {
				const isChecked = selectedPacks.includes(pack.collection);
				return `
            <label style="display: block;">
                <input type="checkbox" value="${pack.collection}" ${isChecked ? "checked" : ""}>
                ${pack.metadata.label}
            </label>
        `;
			})
			.join("");

		const container = document.createElement("div");
		container.innerHTML = checkboxesHtml;

		macroPacksInput.style.display = "none"; // hide original input
		const formGroup = macroPacksInput.closest(".form-group");
		formGroup.querySelector(".form-fields").prepend(container);

		const checkboxes = container.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach((cb) => {
			cb.addEventListener("change", () => {
				const selected = Array.from(checkboxes)
					.filter((c) => c.checked)
					.map((c) => c.value);
				macroPacksInput.value = selected.join(",");
			});
		});
	}
	const input = form.querySelector(`code-mirror[name='${moduleId}.scripts']`);

	const hint = `<p class="hint">${game.i18n.localize(`${settings}.scripts.hint`)}</p>`;
	const div = document.createElement("div");
	div.innerHTML = hint.trim();
	input.parentElement.nextElementSibling.replaceWith(div.firstElementChild);

	// Weird workaround to fix the input's value getting extra indents
	const value = game.settings.get(moduleId, "scripts");
	const { name: label, type: field } = game.settings.settings.get(`${moduleId}.scripts`);
	const scriptsInput = field.toInput({
		hash: {
			aria: { label },
			elementType: "code-mirror",
			language: "javascript",
		},
		value,
	});
	input.replaceWith(scriptsInput);
});

Hooks.on("setup", async () => {
	async function preloadCompendium(path) {
		const compendium = game.packs.get(path);
		if (!compendium) {
			ui.notifications.error(`Compendium pack not found: ${path}`);
			console.error(`Compendium pack not found: ${path}`);
			return;
		}

		// Check if the documents are already fully loaded (size of contents vs size of index)
		if (compendium.contents.size === compendium.index.size) {
			return;
		}

		// 2. Iterate through the index and load each document
		let loadedCount = 0;
		await Promise.all(
			compendium.index.map(async (entry) => {
				const doc = await compendium.getDocument(entry._id);
				if (doc) {
					loadedCount++;
				}
			})
		);

		// 3. Confirm all documents are now in the 'contents' Map
		if (loadedCount != compendium.index.size) {
			ui.notifications.warn(
				`Preload incomplete. Loaded ${loadedCount} entries, expected ${compendium.index.size}.`
			);
		}
	}

	try {
		const selectedPacks = (game.settings.get(moduleId, "macroPacks") || "").split(",").filter(Boolean);
		if (selectedPacks.length === 0) return;

		const macroPacks = game.packs.filter((p) => selectedPacks.includes(p.collection));

		for (const pack of macroPacks) {
			// Preload the entire compendium
			await preloadCompendium(pack.collection);
			// Execute all macros in the compendium
			for (const macro of pack) {
				await macro.execute();
			}
		}
	} catch (err) {
		console.error(err);
		ui.notifications.error(`${errors}.syntax`, { localize: true });
	}
});