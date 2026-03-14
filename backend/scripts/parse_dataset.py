"""
parse_dataset.py
Usage: python parse_dataset.py <nc_file_path>
Parses a NetCDF file using Xarray and prints metadata as JSON.
"""
import sys
import json
import xarray as xr
import numpy as np


def parse_dataset(filepath):
    ds = xr.open_dataset(filepath, engine="netcdf4")

    # Extract variable names (exclude coordinate variables)
    coords = set(ds.coords.keys())
    variables = [v for v in ds.data_vars if v not in coords]

    # Time range
    time_range = {}
    if "time" in ds.coords:
        times = ds["time"].values
        time_range = {
            "start": str(np.datetime_as_string(times[0], unit="D")),
            "end": str(np.datetime_as_string(times[-1], unit="D")),
        }

    # Spatial coverage
    spatial_coverage = {}
    if "latitude" in ds.coords or "lat" in ds.coords:
        lat_key = "latitude" if "latitude" in ds.coords else "lat"
        lats = ds[lat_key].values
        spatial_coverage["latMin"] = float(np.min(lats))
        spatial_coverage["latMax"] = float(np.max(lats))
    if "longitude" in ds.coords or "lon" in ds.coords:
        lon_key = "longitude" if "longitude" in ds.coords else "lon"
        lons = ds[lon_key].values
        spatial_coverage["lonMin"] = float(np.min(lons))
        spatial_coverage["lonMax"] = float(np.max(lons))

    ds.close()

    result = {
        "variables": variables,
        "timeRange": time_range,
        "spatialCoverage": spatial_coverage,
    }
    print(json.dumps(result))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)
    parse_dataset(sys.argv[1])
