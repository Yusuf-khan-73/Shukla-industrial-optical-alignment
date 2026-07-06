"""Shared Pydantic configuration and helpers."""
from pydantic import ConfigDict
from pydantic.alias_generators import to_camel

PUBLIC_CONFIG = ConfigDict(
    from_attributes=True,
    populate_by_name=True,
    alias_generator=to_camel,
)

ADMIN_CONFIG = ConfigDict(from_attributes=True, populate_by_name=True)
