"""
get_map_data.py
Usage: python get_map_data.py <nc_file> <variable> [year]
Returns a 2D lat/lon grid of the selected variable as JSON for heatmap rendering.
"""
import sys
import json
import xarray as xr
import numpy as np


def get_map_data(filepath, variable, year=None):
    ds = xr.open_dataset(filepath, engine="netcdf4")

    if variable not in ds:
        print(json.dumps({"error": f"Variable '{variable}' not found in dataset"}))
        sys.exit(1)

    data = ds[variable]

    # Filter by year if provided
    if year and "time" in data.dims:
        year = int(year)
        data = data.sel(time=data.time.dt.year == year)
        # Average over filtered time steps
        data = data.mean(dim="time", skipna=True)
    elif "time" in data.dims:
        # Default: annual mean over all times
        data = data.mean(dim="time", skipna=True)

    # Resolve lat/lon key names
    lat_key = "latitude" if "latitude" in ds.coords else "lat"
    lon_key = "longitude" if "longitude" in ds.coords else "lon"

    lats = ds[lat_key].values.tolist()
    lons = ds[lon_key].values.tolist()
    values = np.where(np.isnan(data.values), None, np.round(data.values, 3)).tolist()

    ds.close()

    print(json.dumps({
        "variable": variable,
        "year": year,
        "latitudes": lats,
        "longitudes": lons,
        "values": values,  # 2D array [lat][lon]
    }))


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: get_map_data.py <file> <variable> [year]"}))
        sys.exit(1)
    filepath = sys.argv[1]
    variable = sys.argv[2]
    year = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else None
    get_map_data(filepath, variable, year)
