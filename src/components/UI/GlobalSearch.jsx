import React from 'react';
import { convertToCSV, downloadCSV } from '../../utils/csvExporter';


export default function DataExport({ dataToExport }) {

  const handleExport = () => {
    if (dataToExport.length === 0) {
      alert('No data to export!');
      return;
    }

    const csvString = convertToCSV(dataToExport);
    downloadCSV(csvString, 'spotify_tracks_export.csv');
  };

  return (
    <button className="export-button" onClick={handleExport} disabled={dataToExport.length === 0}>
      Export Current View ({dataToExport.length}) to CSV
    </button>
  );
}