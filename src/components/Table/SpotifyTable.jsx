import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DataGrid, GridToolbar, GridRowModes } from "@mui/x-data-grid";
import GlobalSearch from "../UI/GlobalSearch";
import DataExport from "../UI/DataExport";
import { useDebounce } from "../../hooks/useDebounce";
import initialData from "../../assets/spotifyData";
import "./SpotifyTable.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark", 
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          backgroundColor: "#1E1E1E", 
          color: "white",
        },
        columnHeader: {
          backgroundColor: "#242424", 
          color: "#b3b3b3",
          fontWeight: "bold",
        },
        row: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#1E1E1E",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#242424",
          },
          "&:hover": {
            backgroundColor: "#303030 !important",
          },
        },
        footerContainer: {
          backgroundColor: "#242424",
          borderTop: "1px solid #303030",
          color: "#b3b3b3",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "white",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#b3b3b3",
        },
      },
    },
  },
});

const applyGlobalSearch = (data, searchTerm) => {
  if (!searchTerm) return data;
  const lowerCaseSearch = searchTerm.toLowerCase();

  return data.filter((row) => {
    if (!row) return false;

    const track =
      row.track_name?.toLowerCase().includes(lowerCaseSearch) ?? false;
    const artist = row.artist?.toLowerCase().includes(lowerCaseSearch) ?? false;
    const album = row.album?.toLowerCase().includes(lowerCaseSearch) ?? false;

    return track || artist || album;
  });
};

export default function SpotifyTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(globalSearchTerm, 300);


  useEffect(() => {
    const loadData = () => {
      setLoading(true);

      const processedData = initialData.map((row, index) => ({
        id: index + 1, 
        ...row,
        // 👇 CRITICAL FIX: Convert the release date string to a Date object here
        track_album_release_date: row.track_album_release_date 
            ? new Date(row.track_album_release_date) 
            : null, // Use null if the date is missing
    }));
      setData(processedData);
      setLoading(false);
    };

    const timer = setTimeout(loadData, 500);
console.log(filteredData)
    return () => clearTimeout(timer); 

  }, []);

  const filteredData = useMemo(() => {
    console.log(`Applying search filter for: "${debouncedSearchTerm}"`);
    return applyGlobalSearch(data, debouncedSearchTerm);
  }, [data, debouncedSearchTerm]);

  

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "track_name", headerName: "Track Name", width: 250 },

      { field: "track_artist", headerName: "Artist", width: 200 },

      { field: "track_album_name", headerName: "Album", width: 200 },

      { field: "playlist_genre", headerName: "Genre", width: 150 },

      {
        field: "track_popularity",
        headerName: "Popularity",
        type: "number",
        width: 100,
      },


      {
        field: "track_album_release_date",
        headerName: "Release Date",
        type: "date",
        width: 150,
      
      },
      
    ],
    []
  );


  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25, 
    page: 0,
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="table-manager-container">
        <h1 className="header-title">🎵 Spotify Track Manager</h1>

        <div className="controls-row">
          <GlobalSearch onSearchChange={setGlobalSearchTerm} />
          <DataExport dataToExport={filteredData} />
        </div>

     
        {loading && (
          <div className="loading-message">Loading 30,000 tracks...</div>
        )}

      
        {!loading && filteredData.length === 0 && debouncedSearchTerm && (
          <div className="empty-state-message">
            No results found for "{debouncedSearchTerm}". Please try a different
            search.
          </div>
        )}

      
        <div
          style={{ height: 650, width: "100%" }}
          className="spotify-data-grid"
        >
          <DataGrid
            rows={filteredData}
            columns={columns}
            loading={loading}
           
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[25, 50, 100]} 
 
            disableColumnMenu
            slots={{
            
              toolbar: GridToolbar,
            }}
          />
        </div>
        <p className="current-view-info">
          Total Tracks: {data.length}. Showing {filteredData.length} matching
          the current search.
        </p>
      </div>
    </ThemeProvider>
  );
}
