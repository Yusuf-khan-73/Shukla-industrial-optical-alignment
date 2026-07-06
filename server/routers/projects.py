"""Project public and admin routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.project import Project, ProjectImage
from schemas.project import ProjectAdmin, ProjectCreate, ProjectPublic, ProjectUpdate
from services.helpers import replace_nested_images, serialize_project

router = APIRouter(tags=["Projects"])


@router.get("/projects", response_model=list[ProjectPublic])
def list_projects(db: DbSession, featured: bool | None = None, industry: str | None = None):
    query = db.query(Project).filter(Project.is_active.is_(True)).order_by(Project.sort_order, Project.id)
    if featured is not None:
        query = query.filter(Project.featured.is_(featured))
    if industry and industry != "all":
        query = query.filter(Project.industry == industry)
    items = query.all()
    return [serialize_project(p) for p in items]


@router.get("/projects/{item_id}", response_model=ProjectPublic)
def get_project(item_id: int, db: DbSession):
    project = (
        db.query(Project)
        .filter(Project.id == item_id, Project.is_active.is_(True))
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return serialize_project(project)


@router.get("/admin/projects", response_model=list[ProjectAdmin])
def admin_list_projects(db: DbSession, _: CurrentUser):
    items = db.query(Project).order_by(Project.sort_order, Project.id).all()
    return [serialize_project(p) | {"isActive": p.is_active, "sortOrder": p.sort_order} for p in items]


@router.post("/admin/projects", response_model=ProjectAdmin, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: DbSession, _: CurrentUser):
    if db.query(Project).filter(Project.slug == payload.slug).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    project = Project(**payload.model_dump(exclude={"images"}))
    for idx, img in enumerate(payload.images):
        project.images.append(
            ProjectImage(
                image_url=img.image_url,
                alt_text=img.alt_text,
                sort_order=img.sort_order or idx,
            )
        )
    db.add(project)
    db.commit()
    db.refresh(project)
    return serialize_project(project) | {"isActive": project.is_active, "sortOrder": project.sort_order}


@router.put("/admin/projects/{item_id}", response_model=ProjectAdmin)
def update_project(item_id: int, payload: ProjectUpdate, db: DbSession, _: CurrentUser):
    project = db.query(Project).filter(Project.id == item_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    data = payload.model_dump(exclude_unset=True)
    images = data.pop("images", None)
    for key, value in data.items():
        setattr(project, key, value)
    if images is not None:
        project.images.clear()
        for idx, img in enumerate(images):
            project.images.append(
                ProjectImage(
                    image_url=img["image_url"],
                    alt_text=img.get("alt_text", ""),
                    sort_order=img.get("sort_order", idx),
                )
            )
    db.commit()
    db.refresh(project)
    return serialize_project(project) | {"isActive": project.is_active, "sortOrder": project.sort_order}


@router.delete("/admin/projects/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(item_id: int, db: DbSession, _: CurrentUser):
    project = db.query(Project).filter(Project.id == item_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
