import pytest

from services.contact_service import sanitize_text, validate_contact_payload


def test_validate_contact_payload_rejects_invalid_input():
    with pytest.raises(ValueError):
        validate_contact_payload(
            {
                "name": "  ",
                "phone": "abc",
                "email": "not-an-email",
                "company_name": "",
                "city": "",
                "service_required": "",
                "message": "short",
            }
        )


def test_sanitize_text_removes_html_and_trims_whitespace():
    value = "  <script>alert('x')</script> Hello <b>World</b>  "
    result = sanitize_text(value)
    assert "alert" not in result.lower()
    assert "hello" in result.lower()
    assert "world" in result.lower()
