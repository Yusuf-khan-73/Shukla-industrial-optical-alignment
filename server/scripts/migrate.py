#!/usr/bin/env python3
"""
Alembic migration helper.
Location: server/scripts/migrate.py

Usage (from server/):
  python scripts/migrate.py upgrade   # alembic upgrade head
  python scripts/migrate.py revision -m "message"  # autogenerate
  python scripts/migrate.py stamp   # stamp head without running
"""
import subprocess
import sys
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parents[1]


def main() -> None:
    args = sys.argv[1:] or ["upgrade", "head"]
    result = subprocess.run(
        [sys.executable, "-m", "alembic", *args],
        cwd=SERVER_DIR,
    )
    raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
