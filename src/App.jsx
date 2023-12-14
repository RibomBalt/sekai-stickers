import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect } from "react";
import characters from "./characters.json";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Switch from "@mui/material/Switch";
import Picker from "./components/Picker";
import Info from "./components/Info";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import { FastAverageColor } from "fast-average-color";
const { ClipboardItem } = window;

function App() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [copyPopupOpen, setCopyPopupOpen] = useState(false);
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [dominantColor, setDominantColor] = useState("#3f50b5");

  const handleClickOpen = () => {
    setInfoOpen(true);
  };

  const handleClose = () => {
    setInfoOpen(false);
  };

  const [character, setCharacter] = useState(49);
  const [text, setText] = useState(characters[character].defaultText.text);
  const [position, setPosition] = useState({
    x: characters[character].defaultText.x,
    y: characters[character].defaultText.y,
  });
  const [fontSize, setFontSize] = useState(characters[character].defaultText.s);
  const [spaceSize, setSpaceSize] = useState(1);
  const [rotate, setRotate] = useState(characters[character].defaultText.r);
  const [curve, setCurve] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const img = new Image();

  useEffect(() => {
    setText(characters[character].defaultText.text);
    setPosition({
      x: characters[character].defaultText.x,
      y: characters[character].defaultText.y,
    });
    setRotate(characters[character].defaultText.r);
    setFontSize(characters[character].defaultText.s);
    setLoaded(false);
  }, [character]);

  img.src = "/img/" + characters[character].img;

  img.onload = () => {
    const fac = new FastAverageColor();
    setDominantColor(fac.getColor(img, { algorithm: "simple" }).hex);
    setLoaded(true);
  };

  let angle = (Math.PI * text.length) / 7;

  const draw = (ctx) => {
    ctx.canvas.width = 296;
    ctx.canvas.height = 256;

    if (loaded && document.fonts.check("12px YurukaStd")) {
      var hRatio = ctx.canvas.width / img.width;
      var vRatio = ctx.canvas.height / img.height;
      var ratio = Math.min(hRatio, vRatio);
      var centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
      var centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio,
      );
      ctx.font = `${fontSize}px YurukaStd, SSFangTangTi`;
      ctx.lineWidth = 9;
      ctx.save();

      ctx.translate(position.x, position.y);
      ctx.rotate(rotate / 10);
      ctx.textAlign = "center";
      ctx.strokeStyle = "white";
      ctx.fillStyle = characters[character].color;
      var lines = text.split("\n");
      if (curve) {
        for (let line of lines) {
          for (let i = 0; i < line.length; i++) {
            ctx.rotate(angle / line.length / 2.5);
            ctx.save();
            ctx.translate(0, -1 * fontSize * 3.5);
            ctx.strokeText(line[i], 0, 0);
            ctx.fillText(line[i], 0, 0);
            ctx.restore();
          }
        }
      } else {
        for (var i = 0, k = 0; i < lines.length; i++) {
          ctx.strokeText(lines[i], 0, k);
          ctx.fillText(lines[i], 0, k);
          k += spaceSize;
        }
        ctx.restore();
      }
    }
  };

  const download = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `${characters[character].name}_prsk.erica.moe.png`;
    link.href = canvas.toDataURL();
    link.click();
    setDownloadPopupOpen(true);
  };

  function b64toBlob(b64Data, contentType = null, sliceSize = null) {
    contentType = contentType || "image/png";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const copy = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
      }),
    ]);
    setCopyPopupOpen(true);
  };

  return (
    <div className="App">
      <Info open={infoOpen} handleClose={handleClose} />
      <div className="container">
        <Typography variant="h3" style={{ "font-family": "YurukaStd" }}>
          Project Sekai Stickers Maker
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Created by{" "}
          <Link
            sx={{ color: dominantColor }}
            onClick={handleClickOpen}
            href="#"
          >
            TheOriginalAyaka and others
          </Link>
          , mirrored by{" "}
          <Link
            sx={{ color: dominantColor }}
            href="https://existentialis.me/@hegel"
          >
            @hegel@existentialis.me
          </Link>
          .
        </Typography>
        <div style={{ height: "1em" }} />
        <div className="vertical">
          <div className="canvas">
            <Canvas draw={draw} />
          </div>
          <Slider
            value={curve ? 256 - position.y + fontSize * 3 : 256 - position.y}
            onChange={(e, v) =>
              setPosition({
                ...position,
                y: curve ? 256 + fontSize * 3 - v : 256 - v,
              })
            }
            min={0}
            max={256}
            step={1}
            orientation="vertical"
            track={false}
            sx={{ color: dominantColor }}
            size="small"
          />
        </div>
        <div className="horizontal">
          <Slider
            className="slider-horizontal"
            value={position.x}
            onChange={(e, v) => setPosition({ ...position, x: v })}
            min={0}
            max={296}
            step={1}
            track={false}
            sx={{ color: dominantColor }}
            size="small"
          />
          <Picker setCharacter={setCharacter} color={dominantColor} />
          <div className="settings">
            <div>
              <label>Rotation: </label>
              <Slider
                value={rotate}
                onChange={(e, v) => setRotate(v)}
                min={-10}
                max={10}
                step={0.2}
                track={false}
                sx={{ color: dominantColor }}
              />
            </div>
            <div>
              <label>
                <nobr>Font size: </nobr>
              </label>
              <Slider
                value={fontSize}
                onChange={(e, v) => setFontSize(v)}
                min={10}
                max={100}
                step={1}
                track={false}
                sx={{ color: dominantColor }}
              />
            </div>
            <div>
              <label>
                <nobr>Line spacing: </nobr>
              </label>
              <Slider
                value={spaceSize}
                onChange={(e, v) => setSpaceSize(v)}
                min={18}
                max={100}
                step={1}
                track={false}
                sx={{ color: dominantColor }}
              />
            </div>
            <div>
              <label>Curve (Beta): </label>
              <Switch
                checked={curve}
                onChange={(e) => {
                  setCurve(e.target.checked);
                  setPosition({
                    x: 100,
                    y: 150,
                  });
                }}
                sx={{ color: dominantColor }}
              />
            </div>
          </div>
          <div className="text">
            <TextField
              label="(multiline) text"
              size="small"
              sx={{ color: dominantColor }}
              value={text}
              multiline={true}
              fullWidth
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div style={{ height: "1rem" }} />
          <ButtonGroup size="large">
            <Button
              variant="outlined"
              onClick={copy}
              startIcon={<ContentCopyTwoToneIcon />}
              style={{ "font-family": "YurukaStd" }}
              sx={{ color: dominantColor }}
            >
              copy
            </Button>
            <Button
              variant="outlined"
              onClick={download}
              startIcon={<DownloadTwoToneIcon />}
              style={{ "font-family": "YurukaStd" }}
              sx={{ color: dominantColor }}
            >
              download
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <Snackbar
        open={copyPopupOpen}
        autoHideDuration={2000}
        onClose={() => setCopyPopupOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message="Copied image to clipboard"
      />
      <Snackbar
        open={downloadPopupOpen}
        autoHideDuration={2000}
        onClose={() => setDownloadPopupOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message="Downlading image..."
      />
    </div>
  );
}

export default App;
