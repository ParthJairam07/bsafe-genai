from io import StringIO

import pandas as pd
from fastapi import UploadFile


async def parse_csv_upload(file: UploadFile) -> list[dict]:
    """Read an uploaded CSV file into a list of row dicts."""
    content = await file.read()
    text = content.decode("utf-8")
    df = pd.read_csv(StringIO(text))
    return df.to_dict(orient="records")


def split_results(results: list[dict]) -> tuple[list[dict], list[dict]]:
    """Split audit results into compliant and flagged lists."""
    compliant = []
    flagged = []
    for row in results:
        if str(row.get("compliant", "")).upper() == "TRUE":
            compliant.append(row)
        else:
            flagged.append(row)
    return compliant, flagged
