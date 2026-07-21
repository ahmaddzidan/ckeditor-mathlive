# Copilot Instructions for ckeditor-mathlive

## Project purpose

This repository is a custom CKEditor 5 classic build focused on rich text editing with MathLive support, image handling, and a browser-based manual preview page.

The main source of truth is the editor build definition in `app.js`. The generated bundle in `build/ckeditor_classic.js` is an output artifact and should not be edited manually unless the task is explicitly about bundled output.

## Architecture

- `app.js` defines a `ClassicEditor` subclass, registers CKEditor plugins, customizes `defaultConfig`, and exports the editor as the default export.
- `webpack.config.js` bundles `app.js` into the UMD artifact `build/ckeditor_classic.js` with the global name `ClassicEditor`.
- `index.html` is a manual smoke-test page that loads the generated bundle directly in the browser and exercises image, math, and preview behavior.
- `build/` contains generated assets from webpack.

## Working conventions

- Treat `app.js` as the canonical implementation surface for editor behavior.
- Keep `ClassicEditor.builtinPlugins` and `ClassicEditor.defaultConfig` aligned. If a toolbar item or feature is added, ensure the corresponding plugin is registered.
- Preserve the default export from `app.js` and the UMD output settings in `webpack.config.js`; `index.html` depends on the global `ClassicEditor` symbol.
- Do not hand-edit files under `build/` for source changes. Rebuild instead.
- Follow the existing style: ES module imports in `app.js`, CommonJS in `webpack.config.js`, and minimal inline scripting in `index.html`.

## Behavior-specific notes

- `ClassicEditor.create()` is overridden to inject a custom word-count footer after the CKEditor wrapper. Changes around editor mounting should preserve this DOM placement logic.
- Math support depends on both `mathlive` and `@yayure/ckeditor5-mathlive`. Keep the `mathlive.renderMathPanel()` cleanup behavior intact when modifying panel integration.
- Image alignment for exported HTML is converted to inline styles in `app.js` so transferred content remains standalone. Preserve that data-downcast behavior when changing image style handling.
- `simpleUpload.uploadUrl` in `index.html` points to `https://httpbin.org/post`, which is suitable for demo/testing only and not a production backend.

## Validation workflow

- Primary validation command: `npm run build`
- After changing editor configuration or plugin wiring, rebuild and verify webpack completes successfully.
- For UI-facing changes, also open `index.html` in a browser and manually verify:
  - editor bootstraps without console errors
  - toolbar items appear as expected
  - math panel opens and inserts content correctly
  - image upload, alignment, and resize behavior still match the preview area
  - aligned images in `editor.getData()` use inline styles instead of framework-dependent alignment classes
  - word count still renders below the editor

## Dependency and tooling notes

- This repo currently uses webpack directly; there is no dev server script.
- CKEditor features are imported mostly from package `src` entrypoints, so plugin additions should follow CKEditor 5 source-build patterns already used in `app.js`.
- `npm test` is a placeholder and should not be treated as real validation.

## When making changes

- Prefer focused changes in `app.js` over adjusting generated output.
- If adding a new editor capability, update imports, `builtinPlugins`, and `defaultConfig` together.
- If a change affects runtime HTML or CSS expectations, reflect it in `index.html` so the manual test page remains representative.
- Keep documentation and instructions aligned with the actual build command and current manual test flow.
