import React from "react";

export default function UserItem({ user, onEdit, onDelete }) {
    return (
        <div className="productRow">
            <div className="productMain">
                <div className="productId">#{user.id}</div>
                <div className="productName">{user.name}</div>
                <div className="productPrice">{user.age} лет</div>
            </div>

            <div className="productActions">
                <button className="btn" onClick={() => onEdit(user)}>
                    Редактировать
                </button>
                <button className="btn btn--danger" onClick={() => onDelete(user.id)}>
                    Удалить
                </button>
            </div>
        </div>
    );
}
