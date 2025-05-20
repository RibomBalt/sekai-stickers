import {
  ImageList,
  ImageListItem,
  Popover,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import characters from "../characters.json";
import { PersonSearch } from "@mui/icons-material";

export default function Picker({ setCharacter, color }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "picker" : undefined;

  const handleCharacterSelect = useCallback((index) => {
    handleClose();
    setCharacter(index);
  }, [handleClose, setCharacter]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // Memoize the filtered image list items
  const memoizedImageListItems = useMemo(() => {
    const s = search.toLowerCase();
    return characters.map((c, index) => {
      if (
        s === c.id ||
        c.name.toLowerCase().includes(s) ||
        c.character.toLowerCase().includes(s)
      ) {
        return (
          <ImageListItem
            key={index}
            onClick={() => handleCharacterSelect(index)}
            sx={{
              cursor: "pointer",
              "&:hover": {
                opacity: 0.5,
              },
              "&:active": {
                opacity: 0.8,
              },
            }}
          >
            <img
              src={`img/${c.img}`}
              srcSet={`img/${c.img}`}
              alt={c.name}
              loading="lazy"
            />
          </ImageListItem>
        );
      }
      return null;
    });
  }, [search, handleCharacterSelect]);

  return (
    <div>
      <Tooltip title="Pick character">
        <IconButton
          aria-describedby={id}
          color="secondary"
          onClick={handleClick}
          style={{ fontFamily: "YurukaStd" }}
          sx={{ color: color }}
          size="small"
        >
          <PersonSearch />
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="modal"
      >
        <div className="picker-search">
          <TextField
            label="Search character"
            size="small"
            color="secondary"
            value={search}
            multiline
            fullWidth
            onChange={handleSearchChange}
          />
        </div>
        <div className="image-grid-wrapper">
          <ImageList
            sx={{
              width: window.innerWidth < 600 ? 300 : 500,
              height: 450,
              overflow: "visible",
            }}
            cols={window.innerWidth < 600 ? 3 : 4}
            rowHeight={140}
            className="image-grid"
          >
            {memoizedImageListItems}
          </ImageList>
        </div>
      </Popover>
    </div>
  );
}
