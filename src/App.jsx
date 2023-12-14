import {
  Typography,
  Unstable_Grid2 as Grid,
  Link,
  Slider,
  TextField,
  Button,
  ButtonGroup,
  Switch,
  Snackbar,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  KeyboardArrowDown,
  ContentCopyTwoTone,
  DownloadTwoTone,
  ShareTwoTone,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { FastAverageColor } from "fast-average-color";
import characters from "./characters.json";
import Canvas from "./components/Canvas";
import Picker from "./components/Picker";
import Info from "./components/Info";
const { ClipboardItem } = window;

function AltApp() {
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
    } else {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "#212121";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(
        "Pick a character to start ↘️",
        ctx.canvas.width / 2,
        ctx.canvas.height - 10,
      );
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
    <>
      <Grid
        container
        disableEqualOverflow
        direction="column"
        justifyContent="space-evenly" // TODO
        sx={{ "min-height": "100vh", width: "100vw" }}
      >
        <Grid justifyContent="center">
          <Typography
            variant="h3"
            align="center"
            sx={{ fontFamily: "YurukaStd" }}
          >
            Project Sekai Stickers Maker
          </Typography>
          <Typography variant="subtitle1" align="center">
            Created by{" "}
            <Link
              sx={{ color: dominantColor }}
              onClick={handleClickOpen}
              href="#"
            >
              Ayaka and others
            </Link>
            , tweaked by{" "}
            <Link
              sx={{ color: dominantColor }}
              href="https://existentialis.me/@hegel"
              target="_blank"
            >
              @hegel@existentialis.me
            </Link>
            .
          </Typography>
        </Grid>
        <Grid container sx={12} justifyContent="space-evenly">
          <Grid container direction="column" xs={12} sm={7} md={4}>
            <Grid container>
              <Grid
                container
                xs={10}
                justifyContent="space-evenly"
                alignItems="space-evenly"
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Canvas
                    draw={draw}
                    style={{
                      border: "1px solid #eeeeee",
                      "border-radius": "10px",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="start"
                alignItems="center"
                direction="column"
                xs={2}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <KeyboardArrowUp />
                </Grid>
                <Grid
                  sx={{
                    height: "80%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title="move text vertically" placement="right">
                    <Slider
                      value={
                        curve
                          ? 256 - position.y + fontSize * 3
                          : 256 - position.y
                      }
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
                  </Tooltip>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <KeyboardArrowDown />
                </Grid>
              </Grid>
              <Grid
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <KeyboardArrowLeft />
              </Grid>
              <Grid
                xs={8}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="move text horizontally">
                  <Slider
                    value={position.x}
                    onChange={(e, v) => setPosition({ ...position, x: v })}
                    min={0}
                    max={296}
                    step={1}
                    track={false}
                    sx={{ color: dominantColor }}
                    size="small"
                  />
                </Tooltip>
              </Grid>
              <Grid
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <KeyboardArrowRight />
              </Grid>
              <Grid
                xs={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Picker setCharacter={setCharacter} color={dominantColor} />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            sm={0}
            md={0.5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Divider orientation="vertical" />
          </Grid>
          <Grid
            container
            xs={12}
            sm={5}
            md={6}
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              xs={10}
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontFamily="YurukaStd"
                sx={{ flexBasis: "60%" }}
              >
                Rotation
              </Typography>
              <Slider
                value={rotate}
                onChange={(e, v) => setRotate(v)}
                min={-10}
                max={10}
                step={0.2}
                track={false}
                sx={{ color: dominantColor }}
              />
            </Grid>
            <Grid
              item
              xs={10}
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontFamily="YurukaStd"
                sx={{ flexBasis: "60%" }}
              >
                Font size
              </Typography>
              <Slider
                value={fontSize}
                onChange={(e, v) => setFontSize(v)}
                min={10}
                max={100}
                step={1}
                track={false}
                sx={{ color: dominantColor }}
              />
            </Grid>
            <Grid
              item
              xs={10}
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontFamily="YurukaStd"
                sx={{ flexBasis: "60%" }}
              >
                Line spacing
              </Typography>
              <Slider
                value={spaceSize}
                onChange={(e, v) => setSpaceSize(v)}
                min={18}
                max={100}
                step={1}
                track={false}
                sx={{ color: dominantColor }}
              />
            </Grid>
            <Grid
              item
              xs={10}
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontFamily="YurukaStd"
                sx={{ flexBasis: "60%" }}
              >
                Curved text?
              </Typography>
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
            </Grid>
            <Grid item xs={10}>
              <div style={{ height: "0.5rem" }} />
              <TextField
                label="(multiline) text"
                size="small"
                sx={{ color: dominantColor }}
                value={text}
                multiline={true}
                fullWidth
                onChange={(e) => setText(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <div style={{ height: "10px" }} />
        <Grid
          xs={12}
          item
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ButtonGroup size="large">
            <Button
              variant="outlined"
              onClick={copy}
              startIcon={<ContentCopyTwoTone />}
              style={{ "font-family": "YurukaStd" }}
              sx={{ color: dominantColor }}
            >
              copy
            </Button>
            <Button
              variant="outlined"
              onClick={download}
              startIcon={<DownloadTwoTone />}
              style={{ "font-family": "YurukaStd" }}
              sx={{ color: dominantColor }}
            >
              download
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                const files = new Array(img);
                if (navigator.canShare({ files })) {
                  try {
                    navigator.share({
                      files,
                      title: "My PRSK sticker!",
                      text: "Make your own PRSK sticker!",
                      url: "https://prsk.erica.moe/",
                    });
                  } catch (error) {
                    alert(`Error: ${error.message}`);
                  }
                } else {
                  alert(`Your system doesn't support sharing these files.`);
                }
              }}
              startIcon={<ShareTwoTone />}
              style={{ "font-family": "YurukaStd" }}
              sx={{ color: dominantColor }}
            >
              share
            </Button>
          </ButtonGroup>
        </Grid>
        <div style={{ height: "10px" }} />
        <Snackbar
          open={copyPopupOpen}
          autoHideDuration={2000}
          onClose={() => setCopyPopupOpen(false)}
          message="Copied image to clipboard"
        />

        <Snackbar
          open={downloadPopupOpen}
          autoHideDuration={2000}
          onClose={() => setDownloadPopupOpen(false)}
          message="Downlading image..."
        />
      </Grid>
      <Info open={infoOpen} handleClose={handleClose} />
    </>
  );
}

export default AltApp;
