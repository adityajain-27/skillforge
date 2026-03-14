"""
get_time_series.py
Usage: python get_time_series.py <nc_file> <variable> <lat> <lon>
Returns a time series for the nearest grid point to (lat, lon).
"""
import sys
import json
import xarray as xr
import numpy as np


def get_time_series(filepath, variable, lat, lon):
    ds = xr.open_dataset(filepath, engine="netcdf4")

    if variable not in ds:
        print(json.dumps({"error": f"Variable '{variable}' not found in dataset"}))
        sys.exit(1)

    lat = float(lat)
    lon = float(lon)

    lat_key = "latitude" if "latitude" in ds.coords else "lat"
    lon_key = "longitude" if "longitude" in ds.coords else "lon"

    data = ds[variable].sel(
        {lat_key: lat, lon_key: lon},
        method="nearest"
    )

    times = []
    values = []

    if "time" in data.dims:
        for t, v in zip(data.time.values, data.values):
            times.append(str(np.datetime_as_string(t, unit="D")))
            values.append(None if np.isnan(v) else round(float(v), 4))
    else:
        print(json.dumps({"error": "No time dimension in this dataset"}))
        sys.exit(1)

    actual_lat = float(ds[lat_key].sel({lat_key: lat}, method="nearest").values)
    actual_lon = float(ds[lon_key].sel({lon_key: lon}, method="nearest").values)

    ds.close()

    print(json.dumps({
        "variable": variable,
        "requestedLat": lat,
        "requestedLon": lon,
        "actualLat": actual_lat,
        "actualLon": actual_lon,
        "times": times,
        "values": values,
    }))


if __name__ == "__main__":
    if len(sys.argv) < 5:
        print(json.dumps({"error": "Usage: get_time_series.py <file> <variable> <lat> <lon>"}))
        sys.exit(1)
    get_time_series(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
