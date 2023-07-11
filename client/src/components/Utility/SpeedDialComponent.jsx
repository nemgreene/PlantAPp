import SortIcon from "@mui/icons-material/Sort";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
export default function SpeedDialComponent({ sortObj, setSortFunc }) {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "fixed", bottom: 30, right: 30 }}
      FabProps={{
        sx: {
          bgcolor: "#1b5e20",
          "&:hover": {
            bgcolor: "grey",
          },
        },
      }}
      icon={<SortIcon />}
    >
      {Object.keys(sortObj).map((sort, index) => {
        return (
          <SpeedDialAction
            onClick={() => setSortFunc(sortObj[sort])}
            key={index}
            icon={sortObj[sort].icon}
            tooltipTitle={sortObj[sort].tooltip}
          />
        );
      })}
    </SpeedDial>
  );
}
