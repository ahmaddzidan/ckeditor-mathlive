import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import { WordCount } from "@ckeditor/ckeditor5-word-count";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import List from "@ckeditor/ckeditor5-list/src/list";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import FindAndReplace from "@ckeditor/ckeditor5-find-and-replace/src/findandreplace";
import SpecialCharacters from "@ckeditor/ckeditor5-special-characters/src/specialcharacters";
import SpecialCharactersEssentials from "@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials";
import SpecialCharactersMathematical from "@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical";
import SpecialCharactersText from "@ckeditor/ckeditor5-special-characters/src/specialcharacterstext";
import {
  Table,
  TableToolbar,
  TableCaption,
  TableProperties,
  TableColumnResize,
  TableCellProperties,
} from "@ckeditor/ckeditor5-table";
import {
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  ImageResize,
  ImageInsert,
  ImageBlock,
  ImageInline,
  ImageTextAlternative,
} from "@ckeditor/ckeditor5-image";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import ClipboardPipeline from "@ckeditor/ckeditor5-clipboard/src/clipboardpipeline";
import RemoveFormat from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize";
import GeneralHtmlSupport from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupport";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";
import ListProperties from "@ckeditor/ckeditor5-list/src/listproperties";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import "mathlive";
import { Mathlive, MathlivePanelview } from "@yayure/ckeditor5-mathlive";
import {
  Underline,
  Bold,
  Italic,
  Subscript,
  Superscript,
} from "@ckeditor/ckeditor5-basic-styles";
// import ClassicImageResize from "@emagtechlabs/ckeditor5-classic-image-resize";

const IMAGE_ALIGNMENT_CLASSES = [
  "float-start",
  "mx-auto",
  "d-block",
  "float-end",
  "image-style-align-left",
  "image-style-align-center",
  "image-style-align-right",
];

const EXAM_TOOLBAR_ITEMS = [
  "sourceEditing",
  "|",
  "heading",
  "fontSize",
  "alignment",
  "|",
  "bold",
  "italic",
  "underline",
  "subscript",
  "superscript",
  "specialCharacters",
  "|",
  "outdent",
  "indent",
  "bulletedList",
  "numberedList",
  "|",
  "insertTable",
  "imageUpload",
  "mathlive",
  "horizontalLine",
  "blockQuote",
  "removeFormat",
  "|",
  "findAndReplace",
  "undo",
  "redo",
];

const FULL_TOOLBAR_ITEMS = [
  "sourceEditing",
  "|",
  "heading",
  "fontSize",
  "alignment",
  "|",
  "bold",
  "italic",
  "underline",
  "subscript",
  "superscript",
  "specialCharacters",
  "|",
  "outdent",
  "indent",
  "bulletedList",
  "numberedList",
  "|",
  "insertTable",
  "imageUpload",
  "mathlive",
  "horizontalLine",
  "blockQuote",
  "removeFormat",
  "|",
  "findAndReplace",
  "undo",
  "redo",
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function plainTextToHtml(text) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const paragraphs = normalized.split("\n");

  return paragraphs
    .map((line) =>
      line.length ? `<p>${escapeHtml(line)}</p>` : "<p>&nbsp;</p>",
    )
    .join("");
}

const IMAGE_ALIGNMENT_STYLES = {
  alignBlockLeft: {
    display: "table",
    "margin-left": "0",
    "margin-right": "auto",
  },
  alignCenter: {
    display: "table",
    "margin-left": "auto",
    "margin-right": "auto",
  },
  alignBlockRight: {
    display: "table",
    "margin-left": "auto",
    "margin-right": "0",
  },
};

function getAlignmentFromClasses(classList) {
  if (
    classList.contains("float-start") ||
    classList.contains("image-style-align-left")
  ) {
    return "alignBlockLeft";
  }

  if (
    classList.contains("mx-auto") ||
    classList.contains("image-style-align-center")
  ) {
    return "alignCenter";
  }

  if (
    classList.contains("float-end") ||
    classList.contains("image-style-align-right")
  ) {
    return "alignBlockRight";
  }

  return null;
}

function normalizeImageDimension(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return `${value}px`;
  }

  if (/^\d+(?:\.\d+)?$/.test(value)) {
    return `${value}px`;
  }

  return value;
}

function pixelValueFromDimension(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/^(\d+(?:\.\d+)?)px$/);

  if (!match) {
    return null;
  }

  return String(Math.round(Number(match[1])));
}

function inferPixelWidthFromImage(image) {
  if (!image) {
    return null;
  }

  const widthAttr = image.getAttribute("width");

  if (/^\d+(?:\.\d+)?$/.test(widthAttr || "")) {
    return `${Math.round(Number(widthAttr))}px`;
  }

  const heightAttr = image.getAttribute("height");
  const aspectRatio = image.style.aspectRatio || "";
  const ratioMatch = aspectRatio.match(
    /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/,
  );

  if (ratioMatch && /^\d+(?:\.\d+)?$/.test(heightAttr || "")) {
    const ratioWidth = Number(ratioMatch[1]);
    const ratioHeight = Number(ratioMatch[2]);
    const imgHeight = Number(heightAttr);

    if (ratioHeight > 0 && imgHeight > 0) {
      const computedWidth = (ratioWidth / ratioHeight) * imgHeight;
      return `${Math.round(computedWidth)}px`;
    }
  }

  return null;
}

function resolveStandaloneFigureWidth(figure, image) {
  const styleWidth = (figure.style.width || "").trim();

  if (styleWidth && styleWidth !== "100%") {
    return styleWidth;
  }

  const inferredPixelWidth = inferPixelWidthFromImage(image);

  if (inferredPixelWidth) {
    return inferredPixelWidth;
  }

  return styleWidth || "fit-content";
}

function clearStandaloneImageAlignmentStyles(writer, element) {
  for (const styleName of [
    "display",
    "width",
    "max-width",
    "margin-left",
    "margin-right",
  ]) {
    writer.removeStyle(styleName, element);
  }
}

function applyStandaloneImageAlignment(
  writer,
  element,
  imageStyle,
  modelImage,
) {
  clearStandaloneImageAlignmentStyles(writer, element);

  for (const className of IMAGE_ALIGNMENT_CLASSES) {
    writer.removeClass(className, element);
  }

  writer.removeClass("image_resized", element);

  const resizedWidth = normalizeImageDimension(
    modelImage.getAttribute("resizedWidth"),
  );
  const naturalWidth = normalizeImageDimension(
    modelImage.getAttribute("width"),
  );

  const resizedWidthInPixels = pixelValueFromDimension(resizedWidth);
  const exportWidth = resizedWidthInPixels
    ? resizedWidth
    : naturalWidth || resizedWidth;

  if (exportWidth) {
    writer.setStyle("width", exportWidth, element);
  } else {
    writer.setStyle("width", "fit-content", element);
  }

  writer.setStyle("max-width", "100%", element);

  const styles = IMAGE_ALIGNMENT_STYLES[imageStyle];

  if (!styles) {
    return;
  }

  for (const [styleName, value] of Object.entries(styles)) {
    writer.setStyle(styleName, value, element);
  }
}

function getStandaloneImageAlignment(viewElement) {
  const display = viewElement.getStyle("display");
  const marginLeft = viewElement.getStyle("margin-left");
  const marginRight = viewElement.getStyle("margin-right");

  if (display !== "table") {
    return null;
  }

  if ((marginLeft === "0" || marginLeft === "0px") && marginRight === "auto") {
    return "alignBlockLeft";
  }

  if (marginLeft === "auto" && marginRight === "auto") {
    return "alignCenter";
  }

  if (marginLeft === "auto" && (marginRight === "0" || marginRight === "0px")) {
    return "alignBlockRight";
  }

  return null;
}

function getStandaloneImageAlignmentFromFigure(figure) {
  const display = figure.style.display;
  const marginLeft = figure.style.marginLeft;
  const marginRight = figure.style.marginRight;

  if (display === "table") {
    if (
      (marginLeft === "0" || marginLeft === "0px") &&
      marginRight === "auto"
    ) {
      return "alignBlockLeft";
    }

    if (marginLeft === "auto" && marginRight === "auto") {
      return "alignCenter";
    }

    if (
      marginLeft === "auto" &&
      (marginRight === "0" || marginRight === "0px")
    ) {
      return "alignBlockRight";
    }
  }

  return getAlignmentFromClasses(figure.classList);
}

function normalizeImageSecurityPolicy(policy = {}) {
  const defaultPolicy = {
    allowExternalImages: false,
    allowedExternalHosts: [],
    allowedExternalUrlPrefixes: [],
    allowedExternalUrlPatterns: [],
  };

  const mergedPolicy = {
    ...defaultPolicy,
    ...policy,
  };

  return {
    ...mergedPolicy,
    allowedExternalHosts: Array.isArray(mergedPolicy.allowedExternalHosts)
      ? mergedPolicy.allowedExternalHosts
          .map((host) => String(host).trim().toLowerCase())
          .filter(Boolean)
      : [],
    allowedExternalUrlPrefixes: Array.isArray(
      mergedPolicy.allowedExternalUrlPrefixes,
    )
      ? mergedPolicy.allowedExternalUrlPrefixes
          .map((prefix) => String(prefix).trim())
          .filter(Boolean)
      : [],
    allowedExternalUrlPatterns: Array.isArray(
      mergedPolicy.allowedExternalUrlPatterns,
    )
      ? mergedPolicy.allowedExternalUrlPatterns.filter(
          (pattern) => pattern instanceof RegExp,
        )
      : [],
  };
}

function isExternalImageSource(src) {
  return /^https?:\/\//i.test(src) || /^\/\//.test(src);
}

function toAbsoluteHttpUrl(src) {
  if (!src) {
    return "";
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  if (/^\/\//.test(src)) {
    return `${window.location.protocol}${src}`;
  }

  return src;
}

function isAllowedExternalImageSource(src, imageSecurityPolicy) {
  if (!isExternalImageSource(src)) {
    return true;
  }

  if (imageSecurityPolicy.allowExternalImages) {
    return true;
  }

  const absoluteUrl = toAbsoluteHttpUrl(src);

  if (
    imageSecurityPolicy.allowedExternalUrlPrefixes.some((prefix) =>
      absoluteUrl.startsWith(prefix),
    )
  ) {
    return true;
  }

  if (
    imageSecurityPolicy.allowedExternalUrlPatterns.some((pattern) =>
      pattern.test(absoluteUrl),
    )
  ) {
    return true;
  }

  try {
    const hostName = new URL(
      absoluteUrl,
      window.location.origin,
    ).hostname.toLowerCase();

    return imageSecurityPolicy.allowedExternalHosts.some(
      (allowedHost) =>
        hostName === allowedHost || hostName.endsWith(`.${allowedHost}`),
    );
  } catch (_error) {
    return false;
  }
}

function normalizeStandaloneHtml(html, options = {}) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const imageSecurityPolicy = normalizeImageSecurityPolicy(
    options.imageSecurityPolicy,
  );

  // Strictly remove links and external references from exported question HTML.
  const anchors = template.content.querySelectorAll("a");
  for (const anchor of anchors) {
    const replacement = document.createTextNode(anchor.textContent || "");
    anchor.replaceWith(replacement);
  }

  const images = template.content.querySelectorAll("img");
  for (const image of images) {
    const src = image.getAttribute("src") || "";
    const isAllowedSource = isAllowedExternalImageSource(
      src,
      imageSecurityPolicy,
    );

    if (!isAllowedSource) {
      image.removeAttribute("src");
      image.removeAttribute("srcset");
    }

    // Keep image ratio fluid after resize: avoid stale fixed height metadata.
    image.removeAttribute("height");
    image.style.removeProperty("aspect-ratio");
  }

  const figures = template.content.querySelectorAll("figure.image");

  for (const figure of figures) {
    const image = figure.querySelector("img");
    const alignment =
      getStandaloneImageAlignmentFromFigure(figure) || "alignBlockLeft";
    const figureWidth = resolveStandaloneFigureWidth(figure, image);

    for (const className of IMAGE_ALIGNMENT_CLASSES) {
      figure.classList.remove(className);
    }

    figure.classList.remove("image_resized");
    figure.style.display = "table";
    figure.style.maxWidth = "100%";
    figure.style.width = figureWidth;

    if (alignment === "alignCenter") {
      figure.style.marginLeft = "auto";
      figure.style.marginRight = "auto";
    } else if (alignment === "alignBlockRight") {
      figure.style.marginLeft = "auto";
      figure.style.marginRight = "0";
    } else {
      figure.style.marginLeft = "0";
      figure.style.marginRight = "auto";
    }

    if (!image) {
      continue;
    }

    image.style.display = "block";
    image.style.maxWidth = "100%";
    image.style.height = "auto";
    image.style.removeProperty("aspect-ratio");
    image.removeAttribute("height");

    const figureWidthInPixels = pixelValueFromDimension(figureWidth);

    if (figureWidth !== "fit-content") {
      if (figureWidthInPixels) {
        image.style.width = figureWidthInPixels;
      } else {
        image.style.removeProperty("width");
      }

      if (figureWidthInPixels) {
        image.setAttribute("width", figureWidthInPixels);
      } else {
        image.removeAttribute("width");
      }
    } else {
      image.style.removeProperty("width");
      image.removeAttribute("width");
    }
  }

  return template.innerHTML;
}

class StandaloneImageAlignment extends Plugin {
  afterInit() {
    const { editor } = this;
    const imageUtils = editor.plugins.get("ImageUtils");

    editor.conversion.for("dataDowncast").add((dispatcher) => {
      const syncAlignment = (evt, data, conversionApi) => {
        if (!data.item.is("element", "imageBlock")) {
          return;
        }

        const figure = conversionApi.mapper.toViewElement(data.item);

        if (!figure) {
          return;
        }

        applyStandaloneImageAlignment(
          conversionApi.writer,
          figure,
          data.item.getAttribute("imageStyle"),
          data.item,
        );

        const image = imageUtils.findViewImgElement(figure);

        if (!image) {
          return;
        }

        conversionApi.writer.setStyle("display", "block", image);
        conversionApi.writer.setStyle("max-width", "100%", image);
        conversionApi.writer.setStyle("height", "auto", image);
        conversionApi.writer.removeStyle("aspect-ratio", image);
        conversionApi.writer.removeAttribute("height", image);

        const resizedWidth = normalizeImageDimension(
          data.item.getAttribute("resizedWidth"),
        );
        const naturalWidth = normalizeImageDimension(
          data.item.getAttribute("width"),
        );
        const exportWidth = resizedWidth || naturalWidth;
        const exportWidthInPixels = pixelValueFromDimension(exportWidth);

        if (exportWidth) {
          if (exportWidthInPixels) {
            conversionApi.writer.setStyle(
              "width",
              `${exportWidthInPixels}px`,
              image,
            );
          } else {
            conversionApi.writer.removeStyle("width", image);
          }

          if (exportWidthInPixels) {
            conversionApi.writer.setAttribute(
              "width",
              exportWidthInPixels,
              image,
            );
          } else {
            conversionApi.writer.removeAttribute("width", image);
          }
        } else {
          conversionApi.writer.removeStyle("width", image);
          conversionApi.writer.removeAttribute("width", image);
        }
      };

      dispatcher.on("insert:imageBlock", syncAlignment, { priority: "low" });
      dispatcher.on("attribute:imageStyle:imageBlock", syncAlignment, {
        priority: "low",
      });
      dispatcher.on("attribute:width:imageBlock", syncAlignment, {
        priority: "low",
      });
      dispatcher.on("attribute:height:imageBlock", syncAlignment, {
        priority: "low",
      });
      dispatcher.on("attribute:resizedWidth:imageBlock", syncAlignment, {
        priority: "low",
      });
    });

    editor.conversion.for("upcast").add((dispatcher) => {
      dispatcher.on(
        "element:figure",
        (evt, data, conversionApi) => {
          if (!data.modelRange) {
            return;
          }

          const [modelElement] = Array.from(
            data.modelRange.getItems({
              shallow: true,
            }),
          );

          if (
            !modelElement ||
            !modelElement.is("element", "imageBlock") ||
            !conversionApi.schema.checkAttribute(modelElement, "imageStyle")
          ) {
            return;
          }

          const imageStyle = getStandaloneImageAlignment(data.viewItem);

          if (!imageStyle) {
            return;
          }

          conversionApi.writer.setAttribute(
            "imageStyle",
            imageStyle,
            modelElement,
          );
        },
        { priority: "low" },
      );
    });
  }
}

class ForcePlainTextPaste extends Plugin {
  static get requires() {
    return [ClipboardPipeline];
  }

  afterInit() {
    const { editor } = this;

    editor.plugins.get("ClipboardPipeline").on(
      "inputTransformation",
      (evt, data) => {
        const forcePlainTextPaste = editor.config.get("forcePlainTextPaste");

        if (!forcePlainTextPaste || !data.dataTransfer) {
          return;
        }

        const plainText = data.dataTransfer.getData("text/plain");

        if (!plainText) {
          return;
        }

        data.content = editor.data.processor.toView(plainTextToHtml(plainText));
      },
      { priority: "highest" },
    );
  }
}

class ClassicEditor extends ClassicEditorBase {
  static create(element, config = {}) {
    const toolbarProfile = config.toolbarProfile || "exam";

    if (!config.toolbar || !Array.isArray(config.toolbar.items)) {
      config.toolbar = {
        ...(config.toolbar || {}),
        items:
          toolbarProfile === "full"
            ? [...FULL_TOOLBAR_ITEMS]
            : [...EXAM_TOOLBAR_ITEMS],
      };
    }

    config.wordCount = config.wordCount || {};
    const userOnUpdate = config.wordCount.onUpdate;

    config.wordCount.onUpdate = (stats) => {
      // Ambil wrapper editor yg dibuat setelah textarea
      const editorWrapper = element.nextElementSibling;
      if (!editorWrapper) return;

      // Cari atau buat elemen wordcount setelah editor
      let wrapper = editorWrapper.nextElementSibling;
      if (!wrapper || !wrapper.classList.contains("ck-wordcount")) {
        wrapper = document.createElement("div");
        wrapper.classList.add("ck-wordcount");

        // Sisipkan setelah editor wrapper
        editorWrapper.parentNode.insertBefore(
          wrapper,
          editorWrapper.nextSibling,
        );
      }

      // Update isi wordcount
      wrapper.innerHTML = `
                <span style="margin-right:12px;">📝 Kata: ${stats.words}</span>
                <span>🔡 Karakter: ${stats.characters}</span>
            `;

      if (typeof userOnUpdate === "function") {
        userOnUpdate(stats);
      }
    };

    return super.create(element, config).then((editor) => {
      const originalGetData = editor.getData.bind(editor);
      const imageSecurityPolicy = editor.config.get("imageSecurityPolicy");

      editor.getData = (...args) =>
        normalizeStandaloneHtml(originalGetData(...args), {
          imageSecurityPolicy,
        });

      editor.getStandaloneData = (...args) =>
        normalizeStandaloneHtml(originalGetData(...args), {
          imageSecurityPolicy,
        });

      return editor;
    });
  }
}

ClassicEditor.builtinPlugins = [
  Image,
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  FindAndReplace,
  Subscript,
  Superscript,
  Underline,
  Essentials,
  FontSize,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  GeneralHtmlSupport,
  StandaloneImageAlignment,
  ForcePlainTextPaste,
  Indent,
  IndentBlock,
  Italic,
  List,
  ListProperties,
  HorizontalLine,
  MediaEmbed,
  Paragraph,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersEssentials,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  SimpleUploadAdapter,
  SourceEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Mathlive,
  // ClassicImageResize,
  WordCount,
];

ClassicEditor.defaultConfig = {
  forcePlainTextPaste: true,
  imageSecurityPolicy: {
    allowExternalImages: false,
    allowedExternalHosts: ["asesmenpedia.test"],
    allowedExternalUrlPrefixes: [],
    allowedExternalUrlPatterns: [],
  },
  toolbarProfile: "exam",
  toolbar: {
    items: EXAM_TOOLBAR_ITEMS,
    shouldNotGroupWhenFull: false,
  },
  language: "en",
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22],
    supportAllValues: true,
  },
  heading: {
    options: [
      {
        model: "paragraph",
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
  image: {
    resizeUnit: "px",
    resizeOptions: [
      {
        name: "resizeImage:160",
        value: "160",
        label: "160 px",
      },
      {
        name: "resizeImage:240",
        value: "240",
        label: "240 px",
      },
      {
        name: "resizeImage:320",
        value: "320",
        label: "320 px",
      },
      {
        name: "resizeImage:480",
        value: "480",
        label: "480 px",
      },
      {
        name: "resizeImage:640",
        value: "640",
        label: "640 px",
      },
      {
        name: "resizeImage:800",
        value: "800",
        label: "800 px",
      },
      {
        name: "resizeImage:960",
        value: "960",
        label: "960 px",
      },
      {
        name: "resizeImage:1200",
        value: "1200",
        label: "1200 px",
      },
      {
        name: "resizeImage:custom",
        value: "custom",
        label: "Custom",
      },
      {
        name: "resizeImage:original",
        value: null,
        label: "Original",
      },
    ],
    toolbar: [
      "toggleImageCaption",
      "imageTextAlternative",
      "resizeImage",
      "|",
      "imageStyle:alignBlockLeft",
      "imageStyle:alignCenter",
      "imageStyle:alignBlockRight",
    ],
    styles: {
      options: [
        {
          name: "alignBlockLeft",
          title: "Align left",
          modelElements: ["imageBlock"],
          className: "float-start",
        },
        {
          name: "alignCenter",
          title: "Centered image",
          modelElements: ["imageBlock"],
          className: "mx-auto d-block",
        },
        {
          name: "alignBlockRight",
          title: "Align right",
          modelElements: ["imageBlock"],
          className: "float-end",
        },
      ],
    },
  },
  licenseKey: "GPL",
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true,
    },
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
    ],
  },
  mathlive: {
    renderMathPanel(element) {
      let panelView = new MathlivePanelview();
      panelView.mount(element);
      return () => {
        panelView.destroy();
        panelView = null;
      };
    },
  },
};

// Pastikan ekspor dilakukan dengan benar
export default ClassicEditor;
