"""Client public and admin routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.client import Client
from schemas.client import ClientAdmin, ClientCreate, ClientPublic, ClientUpdate

router = APIRouter(tags=["Clients"])


@router.get("/clients", response_model=list[ClientPublic])
def list_clients(db: DbSession, category: str | None = None, featured: bool | None = None):
    query = db.query(Client).filter(Client.is_active.is_(True)).order_by(Client.sort_order, Client.id)
    if category and category != "all":
        query = query.filter(Client.category == category)
    if featured is not None:
        query = query.filter(Client.featured.is_(featured))
    return query.all()


@router.get("/admin/clients", response_model=list[ClientAdmin])
def admin_list_clients(db: DbSession, _: CurrentUser):
    return db.query(Client).order_by(Client.sort_order, Client.id).all()


@router.post("/admin/clients", response_model=ClientAdmin, status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate, db: DbSession, _: CurrentUser):
    client = Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.put("/admin/clients/{item_id}", response_model=ClientAdmin)
def update_client(item_id: int, payload: ClientUpdate, db: DbSession, _: CurrentUser):
    client = db.query(Client).filter(Client.id == item_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client


@router.delete("/admin/clients/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(item_id: int, db: DbSession, _: CurrentUser):
    client = db.query(Client).filter(Client.id == item_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    db.delete(client)
    db.commit()
