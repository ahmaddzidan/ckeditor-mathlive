import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { WordCount } from '@ckeditor/ckeditor5-word-count';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import { Table, TableToolbar, TableCaption, TableProperties, TableColumnResize, TableCellProperties } from '@ckeditor/ckeditor5-table';
import { Image, ImageToolbar, ImageCaption, ImageStyle, ImageUpload, ImageResize, ImageInsert, AutoImage, ImageBlock, ImageInline, ImageInsertViaUrl, ImageTextAlternative } from '@ckeditor/ckeditor5-image';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import GeneralHtmlSupport from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupport";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";
import ListProperties from "@ckeditor/ckeditor5-list/src/listproperties";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import 'mathlive';
import { Mathlive, MathlivePanelview } from '@yayure/ckeditor5-mathlive';
import { Underline, Bold, Italic, Subscript, Superscript } from '@ckeditor/ckeditor5-basic-styles';
import ClassicImageResize from '@emagtechlabs/ckeditor5-classic-image-resize';

class ClassicEditor extends ClassicEditorBase {
    static create(element, config = {}) {
        config.wordCount = config.wordCount || {};
        const userOnUpdate = config.wordCount.onUpdate;

        config.wordCount.onUpdate = stats => {
            // Ambil wrapper editor yg dibuat setelah textarea
            const editorWrapper = element.nextElementSibling;
            if (!editorWrapper) return;

            // Cari atau buat elemen wordcount setelah editor
            let wrapper = editorWrapper.nextElementSibling;
            if (!wrapper || !wrapper.classList.contains('ck-wordcount')) {
                wrapper = document.createElement('div');
                wrapper.classList.add('ck-wordcount');

                // Sisipkan setelah editor wrapper
                editorWrapper.parentNode.insertBefore(wrapper, editorWrapper.nextSibling);
            }

            // Update isi wordcount
            wrapper.innerHTML = `
                <span style="margin-right:12px;">📝 Kata: ${stats.words}</span>
                <span>🔡 Karakter: ${stats.characters}</span>
            `;

            if (typeof userOnUpdate === 'function') {
                userOnUpdate(stats);
            }
        };

        return super.create(element, config);
    }
}

ClassicEditor.builtinPlugins = [
    Image,
    Alignment,
    Autoformat,
    AutoImage,
    Bold,
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
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    GeneralHtmlSupport,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    ListProperties,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
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
    ClassicImageResize,
    WordCount
];

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'sourceEditing',
            '|',
            'heading',
            'fontSize',
            'alignment',
            '|',
            'bold',
            'italic',
            'underline',
            'bulletedList',
            'numberedList',
            'removeFormat',
            '|',
            'insertTable',
            'imageUpload',
            '|',
            'mathlive',
            '|',
            'undo',
            'redo',
            'fullscreen'
        ],
        shouldNotGroupWhenFull: false
    },
    language: 'en',
    fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true
    },
    heading: {
        options: [
            {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph'
            },
            {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1'
            },
            {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2'
            },
            {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3'
            },
            {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4'
            },
            {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5'
            },
            {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6'
            }
        ]
    },
    image: {
        toolbar: [
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'imageSize:lockAspectRatio',
            'imageSize:width',
            'imageSize:height',
            'resizeImage:custom',
        ]
    },
    licenseKey: 'GPL',
    link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
            toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'file'
                }
            }
        }
    },
    list: {
        properties: {
            styles: true,
            startIndex: true,
            reversed: true
        }
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    },
    mathlive: {
        renderMathPanel(element) {
            let panelView = new MathlivePanelview();
            panelView.mount(element);
            return () => {
                panelView.destroy();
                panelView = null;
            }
        }
    }
};

// Pastikan ekspor dilakukan dengan benar
export default ClassicEditor;
