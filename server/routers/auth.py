"""Authentication routes."""
import logging

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends

from config.settings import settings
from core.deps import CurrentUser, DbSession
from core.security import create_access_token, get_password_hash, verify_password
from models.user import User
from schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    ProfileUpdateRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
    VerifyResetTokenResponse,
)
from services.email import send_password_reset_email
from services.password_reset import (
    cleanup_expired_tokens,
    consume_reset_token,
    create_reset_token,
    get_valid_token_record,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DbSession):
    from services.admin_login import find_admin_user_by_login_email

    user = find_admin_user_by_login_email(db, str(payload.email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
    token = create_access_token(user.id)
    return TokenResponse(access_token=token)


@router.post("/token", response_model=TokenResponse, include_in_schema=False)
def login_form(db: DbSession, form: OAuth2PasswordRequestForm = Depends()):
    return login(LoginRequest(email=form.username, password=form.password), db)


@router.get("/me", response_model=UserResponse)
def me(current_user: CurrentUser):
    return current_user


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: DbSession):
    from services.admin_login import find_admin_user_by_login_email

    try:
        cleanup_expired_tokens(db)

        user = find_admin_user_by_login_email(db, str(payload.email))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account is disabled. Please contact the site administrator.",
            )

        raw_token = create_reset_token(db, user)
        reset_url = f"{settings.password_reset_url_base}?token={raw_token}"
        sent = send_password_reset_email(user.email, reset_url)

        if not sent:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to send reset email. Please try again later.",
            )

        return MessageResponse(message="Email sent successfully.")
    except HTTPException:
        raise
    except Exception:
        logger.exception("Forgot password failed for %s", payload.email)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process your request. Please try again later.",
        )


@router.get("/verify-reset-token", response_model=VerifyResetTokenResponse)
def verify_reset_token(db: DbSession, token: str = Query(..., min_length=20)):
    try:
        cleanup_expired_tokens(db)
        record = get_valid_token_record(db, token)

        if not record:
            return VerifyResetTokenResponse(
                valid=False,
                message="Invalid or expired reset token.",
            )

        return VerifyResetTokenResponse(
            valid=True,
            email=record.email,
            message="Token is valid.",
        )
    except Exception:
        logger.exception("Verify reset token failed")
        return VerifyResetTokenResponse(
            valid=False,
            message="Unable to verify reset link. Please try again.",
        )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: DbSession):
    try:
        cleanup_expired_tokens(db)
        record = get_valid_token_record(db, payload.token)

        if not record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token.",
            )

        user = db.query(User).filter(User.id == record.user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token.",
            )

        user.hashed_password = get_password_hash(payload.password)
        db.flush()
        consume_reset_token(db, record)

        return MessageResponse(message="Password updated successfully.")
    except HTTPException:
        raise
    except Exception:
        logger.exception("Reset password failed")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to reset password. Please try again later.",
        )


@router.put("/profile", response_model=UserResponse)
def update_profile(payload: ProfileUpdateRequest, db: DbSession, current_user: CurrentUser):
    data = payload.model_dump(exclude_unset=True)

    # Admin login email is managed exclusively in Company Settings.
    data.pop("email", None)

    for key, value in data.items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/change-password", response_model=MessageResponse)
def change_password(payload: ChangePasswordRequest, db: DbSession, current_user: CurrentUser):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return MessageResponse(message="Password changed successfully.")
