"""
compare_datasets.py
Usage: python compare_datasets.py <nc_file_a> <nc_file_b> <variable> [year_a] [year_b]
Returns two heatmaps and their difference as JSON.
"""
import sys
import json
import xarray as xr
import numpy as np


def load_grid(filepath, variable, year=None):
    ds = xr.open_dataset(filepath, engine="netcdf4")
    data = ds[variable]
    if year and "time" in data.dims:
        data = data.sel(time=data.time.dt.year == int(year)).mean(dim="time", skipna=True)
    elif "time" in data.dims:
        data = data.mean(dim="time", skipna=True)
    lat_key = "latitude" if "latitude" in ds.coords else "lat"
    lon_key = "longitude" if "longitude" in ds.coords else "lon"
    lats = ds[lat_key].values.tolist()
    lons = ds[lon_key].values.tolist()
    values = np.where(np.isnan(data.values), None, np.round(data.values, 3)).tolist()
    ds.close()
    return lats, lons, values, np.nan_to_num(data.values)


def compare_datasets(file_a, file_b, variable, year_a=None, year_b=None):
    lats_a, lons_a, vals_a, arr_a = load_grid(file_a, variable, year_a)
    lats_b, lons_b, vals_b, arr_b = load_grid(file_b, variable, year_b)

    # Compute difference only if grids match
    try:
        diff_arr = arr_b - arr_a
        diff_values = np.round(diff_arr, 3).tolist()
    except ValueError:
        diff_values = None  # Grid shapes differ

    print(json.dumps({
        "variable": variable,
        "datasetA": {"latitudes": lats_a, "longitudes": lons_a, "values": vals_a, "year": year_a},
        "datasetB": {"latitudes": lats_b, "longitudes": lons_b, "values": vals_b, "year": year_b},
        "difference": {"values": diff_values},
    }))


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Usage: compare_datasets.py <file_a> <file_b> <variable> [year_a] [year_b]"}))
        sys.exit(1)
    year_a = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else None
    year_b = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] else None
    compare_datasets(sys.argv[1], sys.argv[2], sys.argv[3], year_a, year_b)
