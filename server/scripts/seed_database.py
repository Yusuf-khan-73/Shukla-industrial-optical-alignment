#!/usr/bin/env python3
"""
Run database seeds from Python (idempotent).
Location: server/scripts/seed_database.py

Usage (from server/):
  python scripts/seed_database.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from database.session import SessionLocal
from services.seed import run_all_seeds


def main() -> None:
    db = SessionLocal()
    try:
        run_all_seeds(db)
        print("Database seed completed successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
