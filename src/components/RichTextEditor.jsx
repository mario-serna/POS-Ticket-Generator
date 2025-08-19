import styled from "@emotion/styled";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

const EditorContainer = styled.div`
  .ProseMirror {
    min-height: 150px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    margin-top: 0.5rem;
    outline: none;
  }

  .menu-bar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  button {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 0.35rem 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #444;
    transition: all 0.2s ease;

    &:hover {
      background: #f5f5f5;
      border-color: #bdbdbd;
    }

    &.is-active {
      background: #e3f2fd;
      color: #1976d2;
      border-color: #90caf9;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const MenuBar = ({ editor }) => {
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setTextSize = (size) => {
    if (size === "14px") {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
    handleClose();
  };

  if (!editor) {
    return null;
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      editor.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);
    // Reset the input to allow selecting the same file again
    event.target.value = "";
  };

  return (
    <div className="menu-bar">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
      <div style={{ position: "relative", display: "inline-block" }}>
        <Button
          onClick={handleClick}
          className={editor.isActive("textStyle") ? "is-active" : ""}
          title="Text Size"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FormatSizeIcon style={{ fontSize: "18px" }} />
          <ArrowDropDownIcon style={{ fontSize: "18px", marginLeft: "-4px" }} />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            style: {
              minWidth: "120px",
            },
          }}
        >
          <MenuItem
            onClick={() => setTextSize("12px")}
            style={{ fontSize: "12px" }}
          >
            Small (12px)
          </MenuItem>
          <MenuItem
            onClick={() => setTextSize("14px")}
            style={{ fontSize: "14px" }}
          >
            Normal (14px)
          </MenuItem>
          <MenuItem
            onClick={() => setTextSize("18px")}
            style={{ fontSize: "18px" }}
          >
            Large (18px)
          </MenuItem>
          <MenuItem
            onClick={() => setTextSize("24px")}
            style={{ fontSize: "24px" }}
          >
            Heading (24px)
          </MenuItem>
          <MenuItem
            onClick={() => setTextSize("32px")}
            style={{ fontSize: "32px" }}
          >
            Title (32px)
          </MenuItem>
        </Menu>
      </div>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        title="Bold"
      >
        <FormatBoldIcon />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        title="Italic"
      >
        <FormatItalicIcon />
      </Button>
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          Left
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          Center
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          Right
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          Justify
        </Button>
      </ButtonGroup>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        title="Bullet List"
      >
        <FormatListBulletedIcon />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        title="Numbered List"
      >
        <FormatListNumberedIcon />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <HorizontalRuleIcon />
      </Button>
      <Button onClick={() => fileInputRef.current.click()} title="Insert Image">
        <ImageIcon />
      </Button>
      <Button
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
        title="Clear Formatting"
      >
        <FormatClearIcon />
      </Button>
    </div>
  );
};

const CustomImage = Image.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      allowBase64: true,
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.style.width || "100%",
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
          style: `width: ${attributes.width}; max-width: 100%; height: auto; cursor: pointer;`,
        }),
      },
      height: {
        default: "auto",
      },
    };
  },
});

export const RichTextEditor = ({ content, onChange }) => {
  console.log(content);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSize, setImageSize] = useState(100);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      CustomImage,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update image size when slider changes
  useEffect(() => {
    if (selectedImage && editor) {
      editor.commands.updateAttributes("image", { width: `${imageSize}%` });
    }
  }, [imageSize, selectedImage, editor]);

  // Set up editor selection update
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { state } = editor;
      const { selection } = state;
      const selectedNode = selection.node;

      if (selectedNode && selectedNode.type.name === "image") {
        setSelectedImage(selectedNode);
        const width = selectedNode.attrs.width || "100%";
        setImageSize(parseInt(width, 10) || 100);
      } else {
        setSelectedImage(null);
      }
    };

    editor.on("selectionUpdate", handleUpdate);
    return () => {
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  return (
    <EditorContainer>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      {selectedImage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
            minWidth: "300px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "10px" }}>Image Size: {imageSize}%</div>
          <input
            type="range"
            min="10"
            max="200"
            value={imageSize}
            onChange={(e) => setImageSize(parseInt(e.target.value, 10))}
            style={{ width: "80%" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5px",
            }}
          >
            <span>10%</span>
            <span>200%</span>
          </div>
        </div>
      )}

      <style jsx="true" global="true">{`
        .ProseMirror {
          img {
            max-width: 100%;
            height: auto;
            transition: width 0.2s ease-in-out;

            &[data-width] {
              width: attr(data-width);
            }
          }

          img.ProseMirror-selectednode {
            outline: 3px solid #68cef8;
          }
        }
      `}</style>
    </EditorContainer>
  );
};
