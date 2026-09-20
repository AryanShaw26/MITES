from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserLogin
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================
# REGISTER
# ============================================

@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    # Check if email already exists

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()


    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    # Hash password

    hashed_password = hash_password(
        user.password
    )


    # Create user

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )


    # Save user

    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# ============================================
# LOGIN
# ============================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # Find user

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()


    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    # Verify password

    password_correct = verify_password(
        user.password,
        existing_user.password_hash
    )


    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    # Create JWT

    access_token = create_access_token(
        {
            "user_id": existing_user.id,
            "email": existing_user.email
        }
    )


    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }